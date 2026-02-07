// Email Report API Route - Uses Resend to send analysis reports
// Requires RESEND_API_KEY environment variable in Vercel

const ALLOWED_ORIGINS = [
  'https://search-calculator.vercel.app',
  'https://talent-gurus.com',
  'https://www.talent-gurus.com',
  'https://search-intelligence-engine.vercel.app',
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

// HTML-escape to prevent XSS in email content
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limiter for email endpoint (stricter: 3 per minute per IP)
const emailRateLimitMap = new Map();
const EMAIL_RATE_WINDOW = 60 * 1000;
const EMAIL_RATE_MAX = 3;

function checkEmailRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const entry = emailRateLimitMap.get(key);

  if (emailRateLimitMap.size > 500) {
    for (const [k, v] of emailRateLimitMap) {
      if (now - v.windowStart > EMAIL_RATE_WINDOW) emailRateLimitMap.delete(k);
    }
  }

  if (!entry || now - entry.windowStart > EMAIL_RATE_WINDOW) {
    emailRateLimitMap.set(key, { windowStart: now, count: 1 });
    return true;
  }

  entry.count++;
  return entry.count <= EMAIL_RATE_MAX;
}

// Email validation - RFC 5322 simplified
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function generateEmailHTML(results) {
  // Escape all dynamic content to prevent XSS
  const e = escapeHTML;
  const sectionHeading = (text) => `<h3 style="color:#1d1d1f;font-size:16px;margin:0 0 16px;font-weight:600;">${e(text)}</h3>`;
  const spacer = `<div style="height:32px;"></div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f5f5f7;">
    <tr><td align="center" style="padding:20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="max-width:640px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">

    <!-- Header — White, minimal -->
    <div style="padding:32px 32px 24px;text-align:center;border-bottom:2px solid #2814ff;">
      <h1 style="color:#1d1d1f;margin:0;font-size:20px;font-weight:600;letter-spacing:0.08em;">TALENT GURUS</h1>
      <p style="color:#a1a1a6;margin:8px 0 0;font-size:13px;">Search Intelligence Report</p>
    </div>

    <!-- Score Section — Clean, no circle -->
    <div style="padding:40px 32px 32px;text-align:center;">
      <div style="margin:0 0 16px;">
        <span style="font-size:48px;font-weight:600;color:#2814ff;">${results.score}</span>
        <span style="font-size:16px;color:#a1a1a6;">/10</span>
      </div>
      <h2 style="margin:0 0 4px;color:#1d1d1f;font-size:22px;font-weight:600;">${e(results.displayTitle)}</h2>
      <p style="margin:0 0 12px;color:#6e6e73;font-size:14px;">${e(results.location || '')}${results.regionalMultiplier && results.regionalMultiplier !== 1 ? ` (${results.regionalMultiplier}x regional adjustment)` : ''}</p>
      <span style="display:inline-block;padding:6px 20px;border-radius:20px;background-color:#f5f5f7;color:#1d1d1f;font-size:14px;font-weight:500;">${e(results.label)} Search</span>
      ${results.confidence ? `<p style="margin:8px 0 0;color:#a1a1a6;font-size:12px;">Confidence: ${e(results.confidence)}</p>` : ''}
    </div>

    <!-- Executive Summary -->
    <div style="padding:0 32px 32px;">
      <div style="border-left:2px solid #2814ff;padding:16px 20px;background-color:#f5f5f7;border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#1d1d1f;font-size:14px;line-height:1.6;">${e(results.bottomLine || '')}</p>
      </div>
    </div>

    ${spacer}

    <!-- Key Metrics — Clean, no colored borders -->
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Key Metrics')}

      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Salary Guidance</strong>
        <p style="margin:6px 0 0;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.salaryRangeGuidance || 'N/A')}</p>
      </div>

      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Timeline</strong>
        <p style="margin:6px 0 0;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.estimatedTimeline || 'N/A')}</p>
      </div>

      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Market Competitiveness</strong>
        <p style="margin:6px 0 0;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.marketCompetitiveness || 'N/A')}</p>
      </div>

      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Candidate Availability</strong>
        <p style="margin:6px 0 0;color:#1d1d1f;font-size:14px;line-height:1.5;"><strong>${e(results.candidateAvailability || 'N/A')}</strong> — ${e(results.availabilityReason || '')}</p>
      </div>
    </div>

    ${spacer}

    <!-- Sourcing Insight -->
    ${results.sourcingInsight ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Where to Find These Candidates')}
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;">
        <p style="margin:0;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.sourcingInsight)}</p>
      </div>
    </div>
    ${spacer}
    ` : ''}

    <!-- Benchmarks -->
    ${results.benchmark ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Salary Benchmarks: ' + results.displayTitle)}
      <table style="width:100%;text-align:center;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="padding:16px;border-radius:8px;">
            <div style="font-size:24px;font-weight:600;color:#1d1d1f;">$${Math.round(results.benchmark.p25/1000)}k</div>
            <div style="font-size:11px;color:#a1a1a6;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;">25th</div>
          </td>
          <td style="width:1px;background-color:#e5e5ea;"></td>
          <td style="padding:16px;border-radius:8px;">
            <div style="font-size:24px;font-weight:600;color:#2814ff;">$${Math.round(results.benchmark.p50/1000)}k</div>
            <div style="font-size:11px;color:#a1a1a6;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;">Median</div>
          </td>
          <td style="width:1px;background-color:#e5e5ea;"></td>
          <td style="padding:16px;border-radius:8px;">
            <div style="font-size:24px;font-weight:600;color:#1d1d1f;">$${Math.round(results.benchmark.p75/1000)}k</div>
            <div style="font-size:11px;color:#a1a1a6;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px;">75th</div>
          </td>
        </tr>
      </table>
      ${results.benchmark.benefits ? `
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e5ea;padding-top:12px;">
        <tr>
          <td style="padding:12px 8px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#1d1d1f;">Housing</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:2px;">${results.benchmark.benefits.housing || 'N/A'}</div>
          </td>
          <td style="padding:12px 8px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#1d1d1f;">Vehicle</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:2px;">${results.benchmark.benefits.vehicle || 'N/A'}</div>
          </td>
          <td style="padding:12px 8px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#1d1d1f;">Health</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:2px;">${results.benchmark.benefits.health || 'N/A'}</div>
          </td>
          <td style="padding:12px 8px;text-align:center;width:25%;">
            <div style="font-size:11px;font-weight:600;color:#1d1d1f;">Bonus</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:2px;">${results.benchmark.benefits.bonus || 'N/A'}</div>
          </td>
        </tr>
      </table>
      ` : ''}
    </div>
    ${spacer}
    ` : ''}

    <!-- Success Factors -->
    ${results.keySuccessFactors?.length > 0 ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Key Success Factors')}
      ${results.keySuccessFactors.map(f => `
        <div style="padding:12px 16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:8px;">
          <span style="color:#2814ff;font-weight:500;">&#10003;</span> <span style="color:#1d1d1f;font-size:14px;">${e(f)}</span>
        </div>
      `).join('')}
    </div>
    ${spacer}
    ` : ''}

    <!-- Recommendations -->
    ${results.recommendedAdjustments?.length > 0 ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Recommendations')}
      ${results.recommendedAdjustments.map(r => `
        <div style="padding:12px 16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:8px;">
          <span style="color:#2814ff;font-weight:500;">&#8594;</span> <span style="color:#1d1d1f;font-size:14px;">${e(r)}</span>
        </div>
      `).join('')}
    </div>
    ${spacer}
    ` : ''}

    <!-- Red Flag Analysis -->
    ${results.redFlagAnalysis && results.redFlagAnalysis !== "None - well-positioned search" ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Watch Out For')}
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;border-left:2px solid #c77d8a;">
        <p style="margin:0;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.redFlagAnalysis)}</p>
      </div>
    </div>
    ${spacer}
    ` : ''}

    <!-- Market Intelligence -->
    ${results.benchmark?.trends ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Market Intelligence')}
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;">
        <p style="margin:0 0 8px;color:#1d1d1f;font-size:14px;line-height:1.5;">${e(results.benchmark.trends)}</p>
        ${results.benchmark.regionalNotes ? `
        <div style="border-top:1px solid #e5e5ea;padding-top:10px;margin-top:10px;">
          <p style="margin:0;color:#6e6e73;font-size:13px;line-height:1.5;"><strong style="color:#1d1d1f;">Regional Notes:</strong> ${e(results.benchmark.regionalNotes)}</p>
        </div>
        ` : ''}
      </div>
    </div>
    ${spacer}
    ` : ''}

    <!-- Search Intelligence (Tier 2 Data) -->
    ${results.benchmark?.offerAcceptanceRate ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Search Intelligence')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:28px;font-weight:600;color:#2814ff;">${Math.round(results.benchmark.offerAcceptanceRate * 100)}%</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">Offer Acceptance Rate</div>
          </td>
          <td style="width:4%;"></td>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:28px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.counterOfferRate * 100)}%</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">Counter-Offer Rate</div>
          </td>
        </tr>
      </table>
      ${results.benchmark.sourcingChannels ? `
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Sourcing Channel Mix</strong>
        <table style="width:100%;margin-top:12px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="font-size:20px;font-weight:600;color:#2814ff;">${Math.round(results.benchmark.sourcingChannels.referral * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Referral</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.sourcingChannels.agency * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Search Firm</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.sourcingChannels.direct * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Direct</div>
            </td>
            <td style="padding:8px 4px;text-align:center;width:25%;">
              <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.sourcingChannels.internal * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Internal</div>
            </td>
          </tr>
        </table>
      </div>
      ` : ''}
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          ${results.benchmark.salaryGrowthRate ? `
          <td style="padding:12px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:20px;font-weight:600;color:#1d1d1f;">+${Math.round(results.benchmark.salaryGrowthRate * 100)}%</div>
            <div style="font-size:11px;color:#6e6e73;text-transform:uppercase;letter-spacing:0.05em;">Salary Growth YoY</div>
          </td>
          <td style="width:4%;"></td>
          ` : ''}
          ${results.benchmark.typicalExperience ? `
          <td style="padding:12px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:48%;">
            <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${results.benchmark.typicalExperience.min}-${results.benchmark.typicalExperience.typical} yrs</div>
            <div style="font-size:11px;color:#6e6e73;text-transform:uppercase;letter-spacing:0.05em;">Typical Experience</div>
          </td>
          ` : ''}
        </tr>
      </table>
    </div>
    ${spacer}
    ` : ''}

    <!-- Retention & Offer Strategy (Tier 3 Data) -->
    ${results.benchmark?.retentionRisk ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Retention & Offer Strategy')}
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.retentionRisk.firstYearAttrition * 100)}%</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">First-Year Attrition</div>
          </td>
          <td style="width:3%;"></td>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:600;color:#2814ff;">${results.benchmark.relocationWillingness !== undefined ? Math.round(results.benchmark.relocationWillingness * 100) : '—'}%</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">Relocation Willingness</div>
          </td>
          <td style="width:3%;"></td>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;width:31%;">
            <div style="font-size:28px;font-weight:600;color:#1d1d1f;">${results.benchmark.backgroundCheckTimeline || '—'} wks</div>
            <div style="font-size:11px;color:#6e6e73;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em;">Vetting Timeline</div>
          </td>
        </tr>
      </table>
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Top Departure Risks</strong>
        <div style="margin-top:8px;">
          ${(results.benchmark.retentionRisk.topReasons || []).map((reason, i) => `
            <div style="display:inline-block;padding:5px 12px;background-color:#ffffff;border-radius:16px;margin:3px 4px;font-size:12px;color:#1d1d1f;">
              ${reason}
            </div>
          `).join('')}
        </div>
      </div>
      ${results.benchmark.compensationStructure ? `
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;">
        <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Compensation Structure</strong>
        <table style="width:100%;margin-top:10px;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:600;color:#2814ff;">${Math.round(results.benchmark.compensationStructure.basePercent * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Base</div>
            </td>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Bonus</div>
            </td>
            <td style="padding:6px 4px;text-align:center;width:33%;">
              <div style="font-size:20px;font-weight:600;color:#1d1d1f;">${Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%</div>
              <div style="font-size:11px;color:#6e6e73;">Benefits</div>
            </td>
          </tr>
        </table>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e5ea;text-align:center;">
          <span style="font-size:12px;color:#1d1d1f;">Signing bonus in <strong style="color:#2814ff;">${Math.round(results.benchmark.compensationStructure.signingBonusFrequency * 100)}%</strong> of placements</span>
          <span style="font-size:11px;color:#a1a1a6;"> · $${results.benchmark.compensationStructure.signingBonusRange}</span>
        </div>
      </div>
      ` : ''}
    </div>
    ${spacer}
    ` : ''}

    <!-- Negotiation Leverage -->
    ${results.negotiationLeverage ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('Negotiation Leverage')}
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;vertical-align:top;width:48%;">
            <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Candidate Advantages</strong>
            ${(results.negotiationLeverage.candidateAdvantages || []).map(a => `
              <p style="margin:6px 0 0;color:#1d1d1f;font-size:13px;line-height:1.4;">&#8226; ${e(a)}</p>
            `).join('')}
          </td>
          <td style="width:4%;"></td>
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;vertical-align:top;width:48%;">
            <strong style="color:#6e6e73;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Your Advantages</strong>
            ${(results.negotiationLeverage.employerAdvantages || []).map(a => `
              <p style="margin:6px 0 0;color:#1d1d1f;font-size:13px;line-height:1.4;">&#8226; ${e(a)}</p>
            `).join('')}
          </td>
        </tr>
      </table>
    </div>
    ${spacer}
    ` : ''}

    <!-- Decision Intelligence -->
    ${results.decisionIntelligence ? `
    <div style="padding:0 32px 32px;">
      <h3 style="color:#1d1d1f;font-size:18px;margin:0 0 8px;font-weight:600;">Decision Intelligence</h3>
      <p style="color:#6e6e73;font-size:13px;margin:0 0 20px;">Strategic insights to inform your hiring decisions.</p>

      ${results.decisionIntelligence.tradeoffScenarios ? `
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <div style="margin-bottom:10px;">
          <span style="font-size:11px;color:#6e6e73;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Trade-Off Scenarios</span>
        </div>
        ${(results.decisionIntelligence.tradeoffScenarios.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#1d1d1f;font-size:13px;line-height:1.5;padding-left:12px;border-left:2px solid #2814ff;"><span style="color:#2814ff;">&#8594;</span> ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.tradeoffScenarios.completeTeaser ? `
        <p style="margin:10px 0 0;color:#a1a1a6;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.tradeoffScenarios.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      ${results.decisionIntelligence.candidatePsychology ? `
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;margin-bottom:12px;">
        <div style="margin-bottom:10px;">
          <span style="font-size:11px;color:#6e6e73;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">What Top Candidates Care About</span>
        </div>
        ${(results.decisionIntelligence.candidatePsychology.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#1d1d1f;font-size:13px;line-height:1.5;padding-left:12px;border-left:2px solid #2814ff;">&#8226; ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.candidatePsychology.completeTeaser ? `
        <p style="margin:10px 0 0;color:#a1a1a6;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.candidatePsychology.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
        <tr>
          ${results.decisionIntelligence.probabilityOfSuccess ? `
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;vertical-align:top;width:48%;">
            <div style="margin-bottom:10px;">
              <span style="font-size:11px;color:#6e6e73;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Success Probability</span>
            </div>
            <div style="text-align:center;margin:12px 0;">
              <span style="display:inline-block;padding:8px 20px;border-radius:20px;font-size:14px;font-weight:600;background-color:#ffffff;color:#1d1d1f;">${results.decisionIntelligence.probabilityOfSuccess.initialLabel}</span>
            </div>
            ${results.decisionIntelligence.probabilityOfSuccess.completeTeaser ? `
            <p style="margin:8px 0 0;color:#a1a1a6;font-size:10px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.probabilityOfSuccess.completeTeaser)}</p>
            ` : ''}
          </td>
          ` : '<td></td>'}
          <td style="width:4%;"></td>
          ${results.decisionIntelligence.mandateStrength ? `
          <td style="padding:16px;background-color:#f5f5f7;border-radius:8px;vertical-align:top;width:48%;">
            <div style="margin-bottom:10px;">
              <span style="font-size:11px;color:#6e6e73;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Mandate Strength</span>
            </div>
            <div style="text-align:center;margin:8px 0;">
              <span style="font-size:32px;font-weight:600;color:#2814ff;">${
                typeof results.decisionIntelligence.mandateStrength.initial?.score === 'number'
                  ? results.decisionIntelligence.mandateStrength.initial.score.toFixed(1)
                  : results.decisionIntelligence.mandateStrength.initial?.score || 'N/A'
              }</span>
              <span style="font-size:14px;color:#a1a1a6;"> / 10</span>
            </div>
            <p style="margin:4px 0 0;color:#6e6e73;font-size:12px;text-align:center;">${e(results.decisionIntelligence.mandateStrength.initial?.rationale || '')}</p>
            ${results.decisionIntelligence.mandateStrength.completeTeaser ? `
            <p style="margin:8px 0 0;color:#a1a1a6;font-size:10px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.mandateStrength.completeTeaser)}</p>
            ` : ''}
          </td>
          ` : '<td></td>'}
        </tr>
      </table>

      ${results.decisionIntelligence.falseSignals ? `
      <div style="padding:16px;background-color:#f5f5f7;border-radius:8px;border-left:2px solid #c77d8a;">
        <div style="margin-bottom:10px;">
          <span style="font-size:11px;color:#6e6e73;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Don't Be Fooled By</span>
        </div>
        ${(results.decisionIntelligence.falseSignals.initial || []).map(item => `
          <p style="margin:0 0 6px;color:#1d1d1f;font-size:13px;line-height:1.5;">&#9888; ${e(item)}</p>
        `).join('')}
        ${results.decisionIntelligence.falseSignals.completeTeaser ? `
        <p style="margin:10px 0 0;color:#a1a1a6;font-size:11px;font-style:italic;">&#8594; ${e(results.decisionIntelligence.falseSignals.completeTeaser)}</p>
        ` : ''}
      </div>
      ` : ''}

      <div style="margin-top:16px;padding:16px;background-color:#f5f5f7;border-radius:8px;text-align:center;">
        <p style="margin:0 0 4px;color:#2814ff;font-size:13px;font-weight:500;">Go deeper with a search specialist &#8594;</p>
        <p style="margin:0;color:#6e6e73;font-size:11px;">Get the full decision intelligence breakdown and offer strategy.</p>
      </div>
    </div>
    ${spacer}
    ` : ''}

    <!-- Complexity Drivers -->
    ${results.drivers?.length > 0 ? `
    <div style="padding:0 32px 32px;">
      ${sectionHeading('What Makes This Search Tricky')}
      ${results.drivers.map(d => `
        <div style="padding:12px 0;border-bottom:1px solid #e5e5ea;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="vertical-align:middle;">
                <strong style="color:#1d1d1f;font-size:14px;">${e(d.factor)}</strong><br>
                <span style="color:#6e6e73;font-size:13px;">${e(d.rationale)}</span>
              </td>
              <td style="width:50px;text-align:right;vertical-align:middle;">
                <span style="font-size:14px;font-weight:600;color:#2814ff;">+${d.points}</span>
              </td>
            </tr>
          </table>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${spacer}

    <!-- What's Next -->
    <div style="padding:0 32px 32px;">
      ${sectionHeading("What's Next")}
      <p style="margin:0 0 20px;font-size:14px;color:#6e6e73;line-height:1.6;">
        ${e((results.whatsNext && results.whatsNext.intro) || "You've got the data. Here's how we turn it into a successful placement.")}
      </p>

      ${[
        { num: '1', title: 'Discovery Call', duration: '30 min', text: (results.whatsNext && results.whatsNext.discoveryCall) || 'We walk through your analysis together, dig into the nuances that data alone can\'t capture, and align on what the right person looks like.' },
        { num: '2', title: 'Sourcing Strategy', duration: 'Week 1', text: (results.whatsNext && results.whatsNext.sourcingStrategy) || 'Based on your role complexity, location, and budget, we build a sourcing plan — which networks to tap and how to position the opportunity.' },
        { num: '3', title: 'Curated Shortlist', duration: 'Weeks 2-4', text: (results.whatsNext && results.whatsNext.shortlist) || 'You receive a vetted shortlist. Each profile includes social due diligence, reference notes, and our honest assessment.' },
        { num: '4', title: 'Interview & Placement Support', duration: 'Through close', text: (results.whatsNext && results.whatsNext.placementSupport) || 'We coordinate interviews, support offer negotiation, and stay involved through the first 90 days.' },
      ].map(step => `
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="width:40px;vertical-align:top;padding-top:2px;">
              <div style="width:32px;height:32px;border-radius:50%;background-color:#2814ff;color:#fff;text-align:center;line-height:32px;font-size:13px;font-weight:600;">${step.num}</div>
            </td>
            <td style="vertical-align:top;padding-left:12px;">
              <strong style="color:#1d1d1f;font-size:14px;">${e(step.title)}</strong>
              <span style="font-size:11px;color:#a1a1a6;margin-left:6px;">${step.duration}</span><br>
              <span style="color:#6e6e73;font-size:13px;line-height:1.5;">${e(step.text)}</span>
            </td>
          </tr>
        </table>
      `).join('')}

      <div style="background-color:#f5f5f7;border-radius:8px;padding:16px;margin-top:8px;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#1d1d1f;">What the full engagement includes</p>
        ${['Candidate fit & motivation assessment', 'Compensation negotiation playbook', 'Social due diligence', 'Retention risk analysis & 90-day plan', 'Market-tested job positioning'].map(item =>
          `<p style="margin:3px 0;font-size:12px;color:#6e6e73;">&#10003; ${item}</p>`
        ).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div style="background-color:#2814ff;padding:40px 32px;text-align:center;border-radius:0 0 12px 12px;">
      <h3 style="color:#ffffff;margin:0 0 8px;font-size:20px;font-weight:600;">Ready for the Complete Picture?</h3>
      <p style="color:rgba(255,255,255,0.7);margin:0 0 24px;font-size:14px;">Sourcing strategies, compensation deep-dives, and interview frameworks.</p>
      <a href="https://calendly.com/charbel-talentgurus" style="display:inline-block;background-color:#ffffff;color:#2814ff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Schedule Your Consultation</a>
      <p style="color:rgba(255,255,255,0.5);margin:16px 0 0;font-size:12px;">30-minute strategy call &#8226; No commitment</p>
    </div>

    <!-- Data Sources -->
    <div style="padding:24px 32px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#6e6e73;text-transform:uppercase;letter-spacing:0.05em;">Data Sources</p>
      <p style="margin:0;font-size:11px;color:#a1a1a6;line-height:1.6;">
        Bureau of Labor Statistics (BLS) &#8226; Talent Gurus Placement Data &#8226; Indeed, ZipRecruiter, Salary.com, PayScale &#8226; Flying Fish &amp; Quay Group Maritime Reports &#8226; Lighthouse Careers &amp; Morgan &amp; Mallet &#8226; KPMG / Egon Zehnder Family Office Reports &#8226; Regional Cost-of-Living Indices
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 32px;border-top:1px solid #e5e5ea;">
      <p style="margin:0 0 4px;color:#1d1d1f;font-size:12px;font-weight:500;">TALENT GURUS</p>
      <p style="margin:0;color:#a1a1a6;font-size:11px;"><a href="https://talent-gurus.com" style="color:#2814ff;text-decoration:none;">talent-gurus.com</a> &#8226; AI-assisted analysis for informational purposes only.</p>
    </div>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  // CORS — strict origin check, no dev bypass
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting (3 emails per minute per IP)
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress;
  if (!checkEmailRateLimit(clientIP)) {
    return res.status(429).json({ error: 'Too many email requests. Please wait a minute.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Service configuration error' });
  }

  try {
    const { email, results } = req.body;

    if (!isValidEmail(email)) {
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
        subject: `Search Analysis: ${(results.displayTitle || 'Role').substring(0, 100)} — ${results.score}/10 Complexity`,
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
