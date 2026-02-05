// Lead capture API - sends email notification via Resend

const ALLOWED_ORIGINS = [
  'https://search-calculator.vercel.app',
  'https://talent-gurus.com',
  'https://www.talent-gurus.com',
  'https://search-complexity-calculator.vercel.app',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

// Simple rate limiting (in-memory, resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Sanitize user input for HTML email
function sanitizeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Truncate string to max length
function truncate(str, max) {
  if (!str) return '';
  const s = String(str);
  return s.length > max ? s.substring(0, max) + '...' : s;
}

export default async function handler(req, res) {
  // CORS handling
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit check
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL || 'charbel@talent-gurus.com';

  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const body = req.body || {};

    // Extract and sanitize all inputs
    const email = sanitizeHtml(truncate(body.email, 254));
    const phone = sanitizeHtml(truncate(body.phone, 30));
    const positionType = sanitizeHtml(truncate(body.positionType, 100));
    const location = sanitizeHtml(truncate(body.location, 100));
    const timeline = sanitizeHtml(truncate(body.timeline, 50));
    const budgetRange = sanitizeHtml(truncate(body.budgetRange, 50));
    const discretionLevel = sanitizeHtml(truncate(body.discretionLevel, 50));
    const keyRequirements = sanitizeHtml(truncate(body.keyRequirements, 2000));
    const travelRequirement = sanitizeHtml(truncate(body.travelRequirement, 50));
    const propertiesCount = sanitizeHtml(truncate(body.propertiesCount, 20));
    const householdSize = sanitizeHtml(truncate(body.householdSize, 20));
    const aumRange = sanitizeHtml(truncate(body.aumRange, 50));
    const teamSize = sanitizeHtml(truncate(body.teamSize, 20));
    const priorityCallback = !!body.priorityCallback;
    const complexityScore = Number(body.complexityScore) || null;
    const complexityLabel = sanitizeHtml(truncate(body.complexityLabel, 50));
    const languageRequirements = Array.isArray(body.languageRequirements)
      ? body.languageRequirements.slice(0, 10).map(l => sanitizeHtml(truncate(l, 50)))
      : [];
    const certifications = Array.isArray(body.certifications)
      ? body.certifications.slice(0, 10).map(c => sanitizeHtml(truncate(c, 100)))
      : [];

    // Validate email format
    if (!isValidEmail(body.email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Build the email content
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2814ff; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Lead from Search Calculator</h1>
        </div>

        <div style="padding: 20px; background: #f8f9fa;">
          ${priorityCallback ? '<div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong>⚡ PRIORITY CALLBACK REQUESTED</strong></div>' : ''}

          <h2 style="color: #2814ff; margin-top: 0;">Contact Info</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
          </table>

          <h2 style="color: #2814ff;">Search Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Position:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${positionType || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${location || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Timeline:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${timeline || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Budget:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${budgetRange || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Discretion:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${discretionLevel || 'Standard'}</td></tr>
            ${travelRequirement && travelRequirement !== 'minimal' ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Travel:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${travelRequirement}</td></tr>` : ''}
            ${propertiesCount ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Properties:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${propertiesCount}</td></tr>` : ''}
            ${householdSize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Household Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${householdSize}</td></tr>` : ''}
            ${aumRange ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>AUM Range:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${aumRange}</td></tr>` : ''}
            ${teamSize ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Team Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${teamSize}</td></tr>` : ''}
          </table>

          ${languageRequirements && languageRequirements.length > 0 ? `
            <h3 style="color: #2814ff;">Languages Required</h3>
            <p>${languageRequirements.join(', ')}</p>
          ` : ''}

          ${certifications && certifications.length > 0 ? `
            <h3 style="color: #2814ff;">Certifications Required</h3>
            <p>${certifications.join(', ')}</p>
          ` : ''}

          ${keyRequirements ? `
            <h3 style="color: #2814ff;">Additional Requirements</h3>
            <p style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${keyRequirements}</p>
          ` : ''}

          <div style="background: #2814ff; color: white; padding: 16px; border-radius: 8px; margin-top: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold;">${complexityScore || '?'}/10</div>
            <div style="font-size: 14px; opacity: 0.9;">${complexityLabel || 'Complexity Score'}</div>
          </div>

          <p style="color: #6b7280; font-size: 12px; margin-top: 20px; text-align: center;">
            Submitted: ${timestamp} ET
          </p>
        </div>
      </div>
    `;

    const textContent = `
NEW LEAD FROM SEARCH CALCULATOR
${priorityCallback ? '⚡ PRIORITY CALLBACK REQUESTED\n' : ''}
================================

CONTACT INFO
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

SEARCH DETAILS
Position: ${positionType || 'Not specified'}
Location: ${location || 'Not specified'}
Timeline: ${timeline || 'Not specified'}
Budget: ${budgetRange || 'Not specified'}
Discretion: ${discretionLevel || 'Standard'}
${travelRequirement && travelRequirement !== 'minimal' ? `Travel: ${travelRequirement}` : ''}
${propertiesCount ? `Properties: ${propertiesCount}` : ''}
${householdSize ? `Household Size: ${householdSize}` : ''}
${aumRange ? `AUM Range: ${aumRange}` : ''}
${teamSize ? `Team Size: ${teamSize}` : ''}

${languageRequirements && languageRequirements.length > 0 ? `Languages: ${languageRequirements.join(', ')}` : ''}
${certifications && certifications.length > 0 ? `Certifications: ${certifications.join(', ')}` : ''}

${keyRequirements ? `Additional Requirements:\n${keyRequirements}` : ''}

COMPLEXITY SCORE: ${complexityScore || '?'}/10 (${complexityLabel || 'N/A'})

Submitted: ${timestamp} ET
    `.trim();

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Talent Gurus <leads@talent-gurus.com>',
        to: [notifyEmail],
        subject: `${priorityCallback ? '⚡ ' : ''}New Lead: ${positionType || 'Unknown Role'} in ${location || 'Unknown Location'}`,
        html: htmlContent,
        text: textContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      return res.status(500).json({ error: 'Failed to send notification' });
    }

    const result = await response.json();
    console.log('Lead captured:', { email, positionType, location, id: result.id });

    return res.status(200).json({ success: true, id: result.id });

  } catch (error) {
    console.error('Lead capture error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
