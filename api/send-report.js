// Email Report API Route - Uses Resend to send analysis reports
// Requires RESEND_API_KEY environment variable in Vercel

// --- Rate Limiting ---
const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // stricter limit for email endpoint

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimit.set(ip, { windowStart: now, count: 1 });
    return { allowed: true };
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  }
  return { allowed: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimit.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// --- Email Validation ---
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

// --- HTML Escaping ---
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ALLOWED_ORIGINS = [
  'https://search-calculator.vercel.app',
  'https://talent-gurus.com',
  'https://www.talent-gurus.com',
  'https://search-intelligence-engine.vercel.app',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

function generateEmailHTML(results) {
  // Escape helper shorthand
  const e = escapeHtml;
  const score = Number(results.score) || 0;
  const scoreColor = score <= 3 ? '#de9ea9' : score <= 5 ? '#c77d8a' : score <= 7 ? '#9e5f6a' : '#7a4a55';
  const sectionBorder = 'border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;';
  const sectionHeading = (text) => `<h3 style="color:#2814ff;font-size:16px;margin:0 0 16px;font-weight:600;">${e(text)}</h3>`;
  const divider = `<div style="background-color:#ffffff;padding:0 24px 0;${sectionBorder}"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;">
    <tr><td align="center" style="padding:20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;width:100%;">

    <!-- Header -->
    <div style="background-color:#2814ff;border-radius:12px 12px 0 0;padding:24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">TALENT GURUS</h1>
      <p style="color:#d2d4ff;margin:8px 0 0;font-size:14px;">Search Intelligence Report</p>
    </div>

    <!-- Score Section -->
    <div style="background-color:#ffffff;padding:32px 24px;text-align:center;${sectionBorder}">
      <div style="width:110px;height:110px;border-radius:50%;background-color:${scoreColor}15;border:3px solid ${scoreColor};margin:0 auto 16px;line-height:110px;">
        <span style="font-size:40px;font-weight:bold;color:${scoreColor};">${e(score)}</span>
      </div>
      <h2 style="margin:0 0 4px;color:#1e293b;font-size:22px;">${e(results.displayTitle)}</h2>
      <p style="margin:0 0 8px;color:#64748b;font-size:14px;">${e(results.location || '')}${results.regionalMultiplier && results.regionalMultiplier !== 1 ? ` (${e(results.regionalMultiplier)}x regional adjustment)` : ''}</p>
      <span style="display:inline-block;padding:6px 20px;border-radius:20px;background-color:${scoreColor}15;color:${scoreColor};font-size:14px;font-weight:600;">${e(results.label)} Search</span>
      ${results.confidence ? `<p style="margin:8px 0 0;color:#94a3b8;font-size:12px;">Confidence: ${e(results.confidence)}</p>` : ''}
    </div>

    <!-- Executive Summary -->
    <div style="background-color:#ffffff;padding:16px 24px 24px;${sectionBorder}">
      <div style="border-left:4px solid #2814ff;padding:16px;background-color:#f8fafc;border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">${e(results.bottomLine || '')}</p>
      </div>
    </div>

    ${divider}

    <!-- Key Metrics - Full Width Cards -->
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Key Metrics')}

      <!-- Salary -->
      <div style="padding:14px;background-color:#f0f7f5;border-radius:8px;margin-bottom:10px;border-left:4px solid #99c1b9;">
        <strong style="color:#4a776d;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Salary Guidance</strong>
        <p style="margin:6px 0 0;color:#334155;font-size:13px;line-height:1.5;">${e(results.salaryRangeGuidance || 'N/A')}</p>
      </div>

      <!-- Timeline -->
      <div style="padding:14px;background-color:#eeeeff;border-radius:8px;margin-bottom:10px;border-left:4px solid #2814ff;">
        <strong style="color:#2814ff;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Timeline</strong>
        <p style="margin:6px 0 0;color:#334155;font-size:13px;line-height:1.5;">${e(results.estimatedTimeline || 'N/A')}</p>
      </div>

      <!-- Market -->
      <div style="padding:14px;background-color:#fdf2f4;border-radius:8px;margin-bottom:10px;border-left:4px solid #de9ea9;">
        <strong style="color:#9e5f6a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Market Competitiveness</strong>
        <p style="margin:6px 0 0;color:#334155;font-size:13px;line-height:1.5;">${e(results.marketCompetitiveness || 'N/A')}</p>
      </div>

      <!-- Availability -->
      <div style="padding:14px;background-color:#fef8f0;border-radius:8px;border-left:4px solid #f2d0a9;">
        <strong style="color:#a47840;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Candidate Availability</strong>
        <p style="margin:6px 0 0;color:#334155;font-size:13px;line-height:1.5;"><strong>${e(results.candidateAvailability || 'N/A')}</strong> — ${e(results.availabilityReason || '')}</p>
      </div>
    </div>

    ${divider}

    <!-- Sourcing Insight -->
    ${results.sourcingInsight ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Where to Find These Candidates')}
      <div style="padding:14px;background-color:#eeeeff;border-radius:8px;border:1px solid #d2d4ff;">
        <p style="margin:0;color:#334155;font-size:13px;line-height:1.5;">${e(results.sourcingInsight)}</p>
      </div>
    </div>
    ${divider}
    ` : ''}

    <!-- Benchmarks -->
    ${results.benchmark ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Salary Benchmarks: ' + (results.displayTitle || ''))}
      <table style="width:100%;text-align:center;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="padding:14px;background-color:#f8fafc;border-radius:8px;">
            <div style="font-size:24px;font-weight:bold;color:#1e293b;">$${Math.round(results.benchmark.p25/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">25th Percentile</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:14px;background-color:#eeeeff;border-radius:8px;">
            <div style="font-size:24px;font-weight:bold;color:#2814ff;">$${Math.round(results.benchmark.p50/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">Median</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:14px;background-color:#f8fafc;border-radius:8px;">
            <div style="font-size:24px;font-weight:bold;color:#1e293b;">$${Math.round(results.benchmark.p75/1000)}k</div>
            <div style="font-size:11px;color:#94a3b8;">75th Percentile</div>
          </td>
        </tr>
      </table>
      ${results.benchmark.benefits ? `
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;background-color:#f8fafc;border-radius:6px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#334155;">Housing</div>
            <div style="font-size:11px;color:#64748b;">${e(results.benchmark.benefits.housing || 'N/A')}</div>
          </td>
          <td style="width:4px;"></td>
          <td style="padding:8px;background-color:#f8fafc;border-radius:6px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#334155;">Vehicle</div>
            <div style="font-size:11px;color:#64748b;">${e(results.benchmark.benefits.vehicle || 'N/A')}</div>
          </td>
          <td style="width:4px;"></td>
          <td style="padding:8px;background-color:#f8fafc;border-radius:6px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#334155;">Health</div>
            <div style="font-size:11px;color:#64748b;">${e(results.benchmark.benefits.health || 'N/A')}</div>
          </td>
          <td style="width:4px;"></td>
          <td style="padding:8px;background-color:#f8fafc;border-radius:6px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#334155;">Bonus</div>
            <div style="font-size:11px;color:#64748b;">${e(results.benchmark.benefits.bonus || 'N/A')}</div>
          </td>
        </tr>
      </table>
      ` : ''}
    </div>
    ${divider}
    ` : ''}

    <!-- Success Factors -->
    ${results.keySuccessFactors?.length > 0 ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Key Success Factors')}
      ${results.keySuccessFactors.map(f => `
        <div style="padding:10px 12px;background-color:#f0f7f5;border-radius:8px;margin-bottom:8px;border:1px solid #c2ddd7;">
          <span style="color:#5f9488;font-weight:bold;">&#10003;</span> <span style="color:#334155;font-size:13px;">${e(f)}</span>
        </div>
      `).join('')}
    </div>
    ${divider}
    ` : ''}

    <!-- Recommendations -->
    ${results.recommendedAdjustments?.length > 0 ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Recommendations')}
      ${results.recommendedAdjustments.map(r => `
        <div style="padding:10px 12px;background-color:#fef8f0;border-radius:8px;margin-bottom:8px;border:1px solid #f2d0a9;">
          <span style="color:#c4975e;font-weight:bold;">&#10140;</span> <span style="color:#334155;font-size:13px;">${e(r)}</span>
        </div>
      `).join('')}
    </div>
    ${divider}
    ` : ''}

    <!-- Red Flag Analysis -->
    ${results.redFlagAnalysis && results.redFlagAnalysis !== "None - well-positioned search" ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Red Flag Analysis')}
      <div style="padding:14px;background-color:#fdf2f4;border-radius:8px;border:1px solid #ebc7cd;">
        <p style="margin:0;color:#334155;font-size:13px;line-height:1.5;">${e(results.redFlagAnalysis)}</p>
      </div>
    </div>
    ${divider}
    ` : ''}

    <!-- Market Intelligence -->
    ${results.benchmark?.trends ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Market Intelligence')}
      <div style="padding:14px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;color:#334155;font-size:13px;line-height:1.5;">${e(results.benchmark.trends)}</p>
        ${results.benchmark.regionalNotes ? `
        <div style="border-top:1px solid #e2e8f0;padding-top:10px;margin-top:10px;">
          <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;"><strong>Regional Notes:</strong> ${e(results.benchmark.regionalNotes)}</p>
        </div>
        ` : ''}
      </div>
    </div>
    ${divider}
    ` : ''}

    <!-- Search Intelligence (Tier 2 Data) -->
    ${results.benchmark?.offerAcceptanceRate ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Search Intelligence')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <td style="padding:12px;background-color:#eeeeff;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:28px;font-weight:bold;color:#2814ff;">${Math.round(results.benchmark.offerAcceptanceRate * 100)}%</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Offer Acceptance Rate</div>
            <div style="font-size:10px;color:#94a3b8;">~${results.benchmark.offerAcceptanceRate > 0 ? (1 / results.benchmark.offerAcceptanceRate).toFixed(1) : '—'} candidates per placement</div>
          </td>
          <td style="width:4%;"></td>
          <td style="padding:12px;background-color:#fdf2f4;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:28px;font-weight:bold;color:#9e5f6a;">${Math.round(results.benchmark.counterOfferRate * 100)}%</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Counter-Offer Rate</div>
            <div style="font-size:10px;color:#94a3b8;">Risk of candidate retention by current employer</div>
          </td>
        </tr>
      </table>
      ${results.benchmark.sourcingChannels ? `
      <div style="padding:14px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:12px;">
        <strong style="color:#334155;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Sourcing Channel Mix</strong>
        <table style="width:100%;margin-top:10px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="height:${Math.round(results.benchmark.sourcingChannels.referral * 80)}px;min-height:12px;background-color:#2814ff;border-radius:4px 4px 0 0;margin:0 auto;width:40px;"></div>
              <div style="font-size:16px;font-weight:bold;color:#2814ff;margin-top:6px;">${Math.round(results.benchmark.sourcingChannels.referral * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Referral</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="height:${Math.round(results.benchmark.sourcingChannels.agency * 80)}px;min-height:12px;background-color:#de9ea9;border-radius:4px 4px 0 0;margin:0 auto;width:40px;"></div>
              <div style="font-size:16px;font-weight:bold;color:#9e5f6a;margin-top:6px;">${Math.round(results.benchmark.sourcingChannels.agency * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Agency</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="height:${Math.round(results.benchmark.sourcingChannels.direct * 80)}px;min-height:12px;background-color:#99c1b9;border-radius:4px 4px 0 0;margin:0 auto;width:40px;"></div>
              <div style="font-size:16px;font-weight:bold;color:#4a776d;margin-top:6px;">${Math.round(results.benchmark.sourcingChannels.direct * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Direct</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="height:${Math.round(results.benchmark.sourcingChannels.internal * 80)}px;min-height:12px;background-color:#f2d0a9;border-radius:4px 4px 0 0;margin:0 auto;width:40px;"></div>
              <div style="font-size:16px;font-weight:bold;color:#a47840;margin-top:6px;">${Math.round(results.benchmark.sourcingChannels.internal * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Internal</div>
            </td>
          </tr>
        </table>
      </div>
      ` : ''}
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          ${results.benchmark.salaryGrowthRate ? `
          <td style="padding:10px;background-color:#f0f7f5;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:20px;font-weight:bold;color:#4a776d;">+${Math.round(results.benchmark.salaryGrowthRate * 100)}%</div>
            <div style="font-size:11px;color:#64748b;">Salary Growth YoY</div>
          </td>
          <td style="width:4%;"></td>
          ` : ''}
          ${results.benchmark.typicalExperience ? `
          <td style="padding:10px;background-color:#fef8f0;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:20px;font-weight:bold;color:#a47840;">${results.benchmark.typicalExperience.min}-${results.benchmark.typicalExperience.typical} yrs</div>
            <div style="font-size:11px;color:#64748b;">Typical Experience Range</div>
          </td>
          ` : ''}
        </tr>
      </table>
    </div>
    ${divider}
    ` : ''}

    <!-- Retention & Offer Strategy (Tier 3 Data) -->
    ${results.benchmark?.retentionRisk ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Retention & Offer Strategy')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <td style="padding:12px;background-color:#fef2f2;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:bold;color:#dc2626;">${Math.round(results.benchmark.retentionRisk.firstYearAttrition * 100)}%</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">First-Year Attrition</div>
          </td>
          <td style="width:3%;"></td>
          <td style="padding:12px;background-color:#eeeeff;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:bold;color:#2814ff;">${results.benchmark.relocationWillingness !== undefined ? Math.round(results.benchmark.relocationWillingness * 100) : '—'}%</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Relocation Willingness</div>
          </td>
          <td style="width:3%;"></td>
          <td style="padding:12px;background-color:#f0f7f5;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:bold;color:#4a776d;">${results.benchmark.backgroundCheckTimeline || '—'} wks</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Vetting Timeline</div>
          </td>
        </tr>
      </table>
      <div style="padding:14px;background-color:#fef8f0;border-radius:8px;border:1px solid #f2d0a9;margin-bottom:12px;">
        <strong style="color:#a47840;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Top Departure Risks</strong>
        <div style="margin-top:8px;">
          ${(results.benchmark.retentionRisk.topReasons || []).map((reason, i) => `
            <div style="display:inline-block;padding:5px 12px;background-color:#fff;border:1px solid #e2e8f0;border-radius:16px;margin:3px 4px;font-size:12px;color:#475569;">
              ${e(reason)}
            </div>
          `).join('')}
        </div>
      </div>
      ${results.benchmark.compensationStructure ? `
      <div style="padding:14px;background-color:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <strong style="color:#334155;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Comp Structure Blueprint</strong>
        <table style="width:100%;margin-top:10px;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:bold;color:#2814ff;">${Math.round(results.benchmark.compensationStructure.basePercent * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Base Salary</div>
            </td>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:bold;color:#9e5f6a;">${Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Bonus</div>
            </td>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:bold;color:#4a776d;">${Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%</div>
              <div style="font-size:10px;color:#64748b;">Benefits</div>
            </td>
          </tr>
        </table>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e2e8f0;text-align:center;">
          <span style="font-size:12px;color:#475569;">Signing bonus offered in <strong style="color:#2814ff;">${Math.round(results.benchmark.compensationStructure.signingBonusFrequency * 100)}%</strong> of placements</span>
          <span style="font-size:11px;color:#94a3b8;"> · Typical range: $${e(results.benchmark.compensationStructure.signingBonusRange)}</span>
        </div>
      </div>
      ` : ''}
    </div>
    ${divider}
    ` : ''}

    <!-- Negotiation Leverage -->
    ${results.negotiationLeverage ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Negotiation Leverage')}
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:14px;background-color:#fdf2f4;border-radius:8px;vertical-align:top;width:48%;">
            <strong style="color:#9e5f6a;font-size:12px;text-transform:uppercase;">Candidate Advantages</strong>
            ${(results.negotiationLeverage.candidateAdvantages || []).map(a => `
              <p style="margin:6px 0 0;color:#334155;font-size:12px;line-height:1.4;">&#8226; ${e(a)}</p>
            `).join('')}
          </td>
          <td style="width:4%;"></td>
          <td style="padding:14px;background-color:#f0f7f5;border-radius:8px;vertical-align:top;width:48%;">
            <strong style="color:#4a776d;font-size:12px;text-transform:uppercase;">Your Advantages</strong>
            ${(results.negotiationLeverage.employerAdvantages || []).map(a => `
              <p style="margin:6px 0 0;color:#334155;font-size:12px;line-height:1.4;">&#8226; ${e(a)}</p>
            `).join('')}
          </td>
        </tr>
      </table>
    </div>
    ${divider}
    ` : ''}

    <!-- Decision Intelligence -->
    ${results.decisionIntelligence ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      <h3 style="color:#2814ff;font-size:18px;margin:0 0 8px;font-weight:600;">Decision Intelligence</h3>
      <p style="color:#64748b;font-size:12px;margin:0 0 20px;">Strategic insights to inform your hiring decisions.</p>

      <!-- Trade-Off Scenarios -->
      ${results.decisionIntelligence.tradeoffScenarios ? `
      <div style="padding:16px;background-color:#f8fafc;border-radius:8px;margin-bottom:12px;border:1px solid #e2e8f0;">
        <div style="margin-bottom:10px;">
          <span style="display:inline-block;padding:3px 8px;background-color:#d2d4ff;border-radius:4px;font-size:11px;color:#2814ff;font-weight:600;">TRADE-OFF SCENARIOS</span>
        </div>
        ${(results.decisionIntelligence.tradeoffScenarios.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#334155;font-size:13px;line-height:1.5;padding-left:12px;border-left:2px solid #a5a8ff;"><span style="color:#2814ff;font-weight:500;">&#8594;</span> ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.tradeoffScenarios.completeTeaser ? `
        <p style="margin:10px 0 0;color:#94a3b8;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.tradeoffScenarios.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      <!-- Candidate Psychology -->
      ${results.decisionIntelligence.candidatePsychology ? `
      <div style="padding:16px;background-color:#f8fafc;border-radius:8px;margin-bottom:12px;border:1px solid #e2e8f0;">
        <div style="margin-bottom:10px;">
          <span style="display:inline-block;padding:3px 8px;background-color:#f5e6e9;border-radius:4px;font-size:11px;color:#9e5f6a;font-weight:600;">CANDIDATE PSYCHOLOGY</span>
        </div>
        ${(results.decisionIntelligence.candidatePsychology.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#334155;font-size:13px;line-height:1.5;padding-left:12px;border-left:2px solid #de9ea9;">&#8226; ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.candidatePsychology.completeTeaser ? `
        <p style="margin:10px 0 0;color:#94a3b8;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.candidatePsychology.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      <!-- Probability & Mandate - Side by side -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          ${results.decisionIntelligence.probabilityOfSuccess ? `
          <td style="padding:16px;background-color:#f8fafc;border-radius:8px;vertical-align:top;width:48%;border:1px solid #e2e8f0;">
            <div style="margin-bottom:10px;">
              <span style="display:inline-block;padding:3px 8px;background-color:#d2d4ff;border-radius:4px;font-size:11px;color:#2814ff;font-weight:600;">SUCCESS PROBABILITY</span>
            </div>
            <div style="text-align:center;margin:12px 0;">
              <span style="display:inline-block;padding:8px 20px;border-radius:20px;font-size:14px;font-weight:700;${
                results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'High'
                  ? 'background-color:#f0f7f5;color:#4a776d;'
                  : results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'Moderate'
                  ? 'background-color:#fef8f0;color:#a47840;'
                  : 'background-color:#fdf2f4;color:#9e5f6a;'
              }">${e(results.decisionIntelligence.probabilityOfSuccess.initialLabel)}</span>
            </div>
            ${results.decisionIntelligence.probabilityOfSuccess.completeTeaser ? `
            <p style="margin:8px 0 0;color:#94a3b8;font-size:10px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.probabilityOfSuccess.completeTeaser)}</p>
            ` : ''}
          </td>
          ` : '<td></td>'}
          <td style="width:4%;"></td>
          ${results.decisionIntelligence.mandateStrength ? `
          <td style="padding:16px;background-color:#f8fafc;border-radius:8px;vertical-align:top;width:48%;border:1px solid #e2e8f0;">
            <div style="margin-bottom:10px;">
              <span style="display:inline-block;padding:3px 8px;background-color:#f5e6e9;border-radius:4px;font-size:11px;color:#9e5f6a;font-weight:600;">MANDATE STRENGTH</span>
            </div>
            <div style="text-align:center;margin:8px 0;">
              <span style="font-size:32px;font-weight:bold;color:#2814ff;">${
                typeof results.decisionIntelligence.mandateStrength.initial?.score === 'number'
                  ? results.decisionIntelligence.mandateStrength.initial.score.toFixed(1)
                  : results.decisionIntelligence.mandateStrength.initial?.score || 'N/A'
              }</span>
              <span style="font-size:14px;color:#94a3b8;"> / 10</span>
            </div>
            <p style="margin:4px 0 0;color:#64748b;font-size:12px;text-align:center;">${e(results.decisionIntelligence.mandateStrength.initial?.rationale || '')}</p>
            ${results.decisionIntelligence.mandateStrength.completeTeaser ? `
            <p style="margin:8px 0 0;color:#94a3b8;font-size:10px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.mandateStrength.completeTeaser)}</p>
            ` : ''}
          </td>
          ` : '<td></td>'}
        </tr>
      </table>

      <!-- False Signal Warnings -->
      ${results.decisionIntelligence.falseSignals ? `
      <div style="padding:16px;background-color:#fef8f0;border-radius:8px;border:1px solid #f2d0a9;">
        <div style="margin-bottom:10px;">
          <span style="display:inline-block;padding:3px 8px;background-color:#f2d0a9;border-radius:4px;font-size:11px;color:#a47840;font-weight:600;">&#9888; FALSE SIGNAL WARNINGS</span>
        </div>
        ${(results.decisionIntelligence.falseSignals.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#334155;font-size:13px;line-height:1.5;padding-left:12px;border-left:2px solid #f2d0a9;">&#9888; ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.falseSignals.completeTeaser ? `
        <p style="margin:10px 0 0;color:#a47840;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.falseSignals.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      <!-- Unlock CTA -->
      <div style="margin-top:16px;padding:14px;background-color:#eeeeff;border-radius:8px;text-align:center;border:1px solid #d2d4ff;">
        <p style="margin:0 0 4px;color:#2814ff;font-size:13px;font-weight:600;">&#8594; Go deeper with a search specialist</p>
        <p style="margin:0;color:#64748b;font-size:11px;">Get the full decision intelligence breakdown, custom sourcing plan, and offer strategy for this role.</p>
      </div>
    </div>
    ${divider}
    ` : ''}

    <!-- Complexity Drivers -->
    ${results.drivers?.length > 0 ? `
    <div style="background-color:#ffffff;padding:20px 24px 24px;${sectionBorder}">
      ${sectionHeading('Complexity Drivers (' + results.drivers.reduce((sum, d) => sum + d.points, 0) + ' points)')}
      ${results.drivers.map(d => `
        <div style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="width:44px;vertical-align:middle;">
                <div style="width:36px;height:36px;border-radius:50%;background-color:#2814ff;color:#fff;text-align:center;line-height:36px;font-size:12px;font-weight:bold;">+${d.points}</div>
              </td>
              <td style="vertical-align:middle;padding-left:8px;">
                <strong style="color:#1e293b;font-size:13px;">${e(d.factor)}</strong><br>
                <span style="color:#64748b;font-size:12px;">${e(d.rationale)}</span>
              </td>
            </tr>
          </table>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="background-color:#2814ff;padding:32px 24px;text-align:center;border-radius:0 0 12px 12px;">
      <h3 style="color:#ffffff;margin:0 0 8px;font-size:20px;">Ready for the Complete Picture?</h3>
      <p style="color:#d2d4ff;margin:0 0 6px;font-size:13px;">Get sourcing strategies, compensation deep-dives, and interview frameworks.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr>
          <td style="padding:8px;text-align:center;width:33%;">
            <div style="background-color:rgba(255,255,255,0.1);border-radius:8px;padding:10px 6px;">
              <strong style="color:#fff;font-size:12px;">Sourcing Strategy</strong>
              <p style="color:#d2d4ff;font-size:10px;margin:4px 0 0;">Where and how to find candidates</p>
            </div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:8px;text-align:center;width:33%;">
            <div style="background-color:rgba(255,255,255,0.1);border-radius:8px;padding:10px 6px;">
              <strong style="color:#fff;font-size:12px;">Comp Deep-Dive</strong>
              <p style="color:#d2d4ff;font-size:10px;margin:4px 0 0;">Benefits, equity, and packaging</p>
            </div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:8px;text-align:center;width:33%;">
            <div style="background-color:rgba(255,255,255,0.1);border-radius:8px;padding:10px 6px;">
              <strong style="color:#fff;font-size:12px;">Interview Framework</strong>
              <p style="color:#d2d4ff;font-size:10px;margin:4px 0 0;">Key questions and criteria</p>
            </div>
          </td>
        </tr>
      </table>
      <a href="https://calendly.com/charbel-talentgurus" style="display:inline-block;background-color:#ffffff;color:#2814ff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">Schedule Your Consultation</a>
      <p style="color:#d2d4ff;margin:12px 0 0;font-size:11px;">30-minute strategy call &#8226; No commitment</p>
    </div>

    <!-- Data Sources -->
    <div style="background-color:#f8fafc;padding:20px 24px;border-radius:8px;margin:0 0 16px;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:bold;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Data Sources</p>
      <p style="margin:0;font-size:10px;color:#94a3b8;line-height:1.6;">
        Bureau of Labor Statistics (BLS) &#8226; Talent Gurus Placement Data &#8226; Indeed, ZipRecruiter, Salary.com, PayScale &#8226; Flying Fish &amp; Quay Group Maritime Reports &#8226; Lighthouse Careers &amp; Morgan &amp; Mallet &#8226; KPMG / Egon Zehnder Family Office Reports &#8226; Regional Cost-of-Living Indices
      </p>
      <p style="margin:8px 0 0;font-size:10px;color:#94a3b8;">Complexity scoring weighs 10 factors: timeline, location, budget, languages, travel, certifications, discretion, seasonality, role scarcity, and market demand.</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px;color:#94a3b8;font-size:11px;">
      <p style="margin:0 0 4px;">TALENT GURUS | <a href="https://talent-gurus.com" style="color:#2814ff;text-decoration:none;">talent-gurus.com</a></p>
      <p style="margin:0;">AI-assisted analysis for informational purposes only. Every search is unique.</p>
    </div>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting (stricter for email endpoint)
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rateLimitResult = checkRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', rateLimitResult.retryAfter);
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { email, results } = req.body;

    // Proper email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    if (!results || !results.displayTitle) {
      return res.status(400).json({ error: 'Results data required' });
    }

    const html = generateEmailHTML(results);

    // Sanitize subject line to prevent header injection
    const safeTitle = String(results.displayTitle || '').replace(/[\r\n]/g, '').slice(0, 100);
    const safeScore = Number(results.score) || 0;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Talent Gurus <reports@talent-gurus.com>',
        to: [email],
        subject: `Search Analysis: ${safeTitle} — ${safeScore}/10 Complexity`,
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
