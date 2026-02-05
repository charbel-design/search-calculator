// Email Report API Route - Uses Resend to send analysis reports
// Requires RESEND_API_KEY environment variable in Vercel

const ALLOWED_ORIGINS = [
  'https://search-calculator.vercel.app',
  'https://talent-gurus.com',
  'https://www.talent-gurus.com',
  'https://search-complexity-calculator.vercel.app',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

function generateEmailHTML(results) {
  const scoreColor = results.score <= 3 ? '#2814ff' : results.score <= 5 ? '#e65100' : results.score <= 7 ? '#bf360c' : '#b71c1c';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">

    <!-- Header -->
    <div style="background-color:#2814ff;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">TALENT GURUS</h1>
      <p style="color:#c7c0ff;margin:8px 0 0;font-size:14px;">Search Complexity Analysis</p>
    </div>

    <!-- Score Section -->
    <div style="background-color:#ffffff;padding:32px 24px;text-align:center;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <div style="width:100px;height:100px;border-radius:50%;background-color:${scoreColor}15;border:3px solid ${scoreColor};margin:0 auto 16px;line-height:100px;">
        <span style="font-size:36px;font-weight:bold;color:${scoreColor};">${results.score}</span>
      </div>
      <h2 style="margin:0 0 4px;color:#1e293b;font-size:20px;">${results.displayTitle}</h2>
      <p style="margin:0 0 4px;color:#64748b;font-size:14px;">${results.location || ''}</p>
      <span style="display:inline-block;padding:4px 16px;border-radius:20px;background-color:${scoreColor}15;color:${scoreColor};font-size:13px;font-weight:600;">${results.label} Search</span>
    </div>

    <!-- Executive Summary -->
    <div style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <div style="border-left:4px solid #2814ff;padding:16px;background-color:#f8fafc;border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">${results.bottomLine || ''}</p>
      </div>
    </div>

    <!-- Key Metrics -->
    <div style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <h3 style="color:#2814ff;font-size:16px;margin:0 0 16px;">Key Metrics</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px;background-color:#ecfdf5;border-radius:8px;vertical-align:top;width:50%;">
            <strong style="color:#065f46;font-size:12px;">SALARY GUIDANCE</strong><br>
            <span style="color:#334155;font-size:13px;">${results.salaryRangeGuidance || 'N/A'}</span>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#eff6ff;border-radius:8px;vertical-align:top;width:50%;">
            <strong style="color:#1e40af;font-size:12px;">TIMELINE</strong><br>
            <span style="color:#334155;font-size:13px;">${results.estimatedTimeline || 'N/A'}</span>
          </td>
        </tr>
        <tr><td colspan="3" style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px;background-color:#faf5ff;border-radius:8px;vertical-align:top;">
            <strong style="color:#6b21a8;font-size:12px;">MARKET</strong><br>
            <span style="color:#334155;font-size:13px;">${results.marketCompetitiveness || 'N/A'}</span>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#fffbeb;border-radius:8px;vertical-align:top;">
            <strong style="color:#92400e;font-size:12px;">AVAILABILITY</strong><br>
            <span style="color:#334155;font-size:13px;"><strong>${results.candidateAvailability || 'N/A'}</strong> — ${results.availabilityReason || ''}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Benchmarks -->
    ${results.benchmark ? `
    <div style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <h3 style="color:#2814ff;font-size:16px;margin:0 0 16px;">Salary Benchmarks</h3>
      <table style="width:100%;text-align:center;border-collapse:collapse;">
        <tr>
          <td style="padding:12px;background-color:#f8fafc;border-radius:8px;">
            <div style="font-size:22px;font-weight:bold;color:#1e293b;">$${Math.round(results.benchmark.p25/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">25th Percentile</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#eef2ff;border-radius:8px;">
            <div style="font-size:22px;font-weight:bold;color:#2814ff;">$${Math.round(results.benchmark.p50/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">Median</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#f8fafc;border-radius:8px;">
            <div style="font-size:22px;font-weight:bold;color:#1e293b;">$${Math.round(results.benchmark.p75/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">75th Percentile</div>
          </td>
        </tr>
      </table>
    </div>
    ` : ''}

    <!-- Success Factors -->
    ${results.keySuccessFactors?.length > 0 ? `
    <div style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <h3 style="color:#2814ff;font-size:16px;margin:0 0 16px;">Key Success Factors</h3>
      ${results.keySuccessFactors.map(f => `
        <div style="padding:10px 12px;background-color:#f0fdf4;border-radius:8px;margin-bottom:8px;border:1px solid #bbf7d0;">
          <span style="color:#166534;">✓</span> <span style="color:#334155;font-size:13px;">${f}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Complexity Drivers -->
    ${results.drivers?.length > 0 ? `
    <div style="background-color:#ffffff;padding:0 24px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <h3 style="color:#2814ff;font-size:16px;margin:0 0 16px;">Complexity Drivers (${results.drivers.reduce((sum, d) => sum + d.points, 0)} points)</h3>
      ${results.drivers.map(d => `
        <div style="display:flex;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9;">
          <span style="display:inline-block;width:36px;height:36px;border-radius:50%;background-color:#2814ff;color:#fff;text-align:center;line-height:36px;font-size:12px;font-weight:bold;margin-right:12px;">+${d.points}</span>
          <div>
            <strong style="color:#1e293b;font-size:13px;">${d.factor}</strong><br>
            <span style="color:#64748b;font-size:12px;">${d.rationale}</span>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="background-color:#2814ff;padding:32px 24px;text-align:center;border-radius:0 0 12px 12px;">
      <h3 style="color:#ffffff;margin:0 0 8px;font-size:18px;">Ready for the Complete Picture?</h3>
      <p style="color:#c7c0ff;margin:0 0 20px;font-size:13px;">Get sourcing strategies, compensation deep-dives, and interview frameworks.</p>
      <a href="https://calendly.com/charbel-talentgurus" style="display:inline-block;background-color:#ffffff;color:#2814ff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Schedule Your Consultation</a>
      <p style="color:#c7c0ff;margin:12px 0 0;font-size:11px;">30-minute strategy call • No commitment</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;color:#94a3b8;font-size:11px;">
      <p style="margin:0 0 4px;">TALENT GURUS | <a href="https://talent-gurus.com" style="color:#2814ff;text-decoration:none;">talent-gurus.com</a></p>
      <p style="margin:0;">AI-assisted analysis for informational purposes only. Every search is unique.</p>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { email, results } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    if (!results || !results.displayTitle) {
      return res.status(400).json({ error: 'Results data required' });
    }

    const html = generateEmailHTML(results);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Talent Gurus <reports@talent-gurus.com>',
        to: [email],
        subject: `Search Analysis: ${results.displayTitle} — ${results.score}/10 Complexity`,
        html: html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to send email' });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Email error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
