// System message for consistent, high-quality responses
const SYSTEM_MESSAGE = `You are a senior recruitment consultant specializing in UHNW (Ultra-High Net Worth) household staffing. You provide warm, direct advice to principals seeking exceptional household staff.

Guidelines:
- Always return valid JSON only, no markdown code blocks
- Use "you/your" when addressing the client
- Never use the word "staffing" - use "search" or "placement" instead
- Be realistic about market conditions and candidate availability
- Provide actionable, specific advice based on the data provided
- Consider regional cost of living, role scarcity, and timing factors`;

// Allowed origins for CORS (add your production domain)
const ALLOWED_ORIGINS = [
  'https://search-calculator.vercel.app',
  'https://talent-gurus.com',
  'https://www.talent-gurus.com',
  process.env.ALLOWED_ORIGIN // Custom domain via env var
].filter(Boolean);

// Input validation
function validateInput(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required and must be a string' };
  }
  if (prompt.length < 50) {
    return { valid: false, error: 'Prompt is too short' };
  }
  if (prompt.length > 10000) {
    return { valid: false, error: 'Prompt exceeds maximum length' };
  }
  return { valid: true };
}

// Fetch with timeout
async function fetchWithTimeout(url, options, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(req, res) {
  // CORS handling
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { prompt } = req.body;

    // Validate input
    const validation = validateInput(prompt);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3, // Lower for more deterministic JSON output
        system: SYSTEM_MESSAGE,
        messages: [{ role: 'user', content: prompt }]
      })
    }, 30000); // 30 second timeout

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'API request failed',
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout');
      return res.status(504).json({ error: 'Request timeout' });
    }
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
