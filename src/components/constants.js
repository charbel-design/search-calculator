import { REGIONAL_MULTIPLIERS } from '../salaryData';

export const APP_VERSION = "3.0.0-enhanced";

export const REGIONAL_ADJUSTMENTS = REGIONAL_MULTIPLIERS;

export const LOCATION_SUGGESTIONS = Object.entries(REGIONAL_MULTIPLIERS)
  .filter(([key]) => !['National_US', 'Midwest_US', 'South_US'].includes(key))
  .map(([key, data]) => data.display || key);

export function getSeasonalityFactor() {
  const month = new Date().getMonth();
  if (month >= 9 || month <= 2) {
    return { factor: month >= 9 && month <= 11 ? 1.15 : 1.05, label: month >= 9 && month <= 11 ? 'Q4 Holiday Season' : 'Q1 New Year' };
  }
  if (month >= 3 && month <= 5) {
    return { factor: 0.95, label: 'Q2 Spring - Peak Hiring' };
  }
  return { factor: 1.0, label: 'Q3 Summer' };
}

export function getComplexityColor(score) {
  if (score <= 3) return { bg: '#f5e6e9', text: '#2814ff' };
  if (score <= 5) return { bg: '#ebc7cd', text: '#2814ff' };
  if (score <= 7) return { bg: '#de9ea9', text: '#2814ff' };
  return { bg: '#c77d8a', text: '#ffffff' };
}

export const sanitizeForPrompt = (text) => {
  if (!text) return '';
  return text
    // Block instruction override patterns
    .replace(/ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/gi, '[filtered]')
    .replace(/disregard\s+(all\s+)?(previous|prior|above|earlier)/gi, '[filtered]')
    .replace(/you\s+are\s+now/gi, '[filtered]')
    .replace(/system\s*:?\s*prompt/gi, '[filtered]')
    .replace(/\bdo\s+not\s+follow\b/gi, '[filtered]')
    .replace(/\boverride\b/gi, '[filtered]')
    .replace(/\breturn\s+only\b/gi, '[filtered]')
    .replace(/\bforget\s+(everything|all|your)\b/gi, '[filtered]')
    // Block role reassignment and new instruction injection
    .replace(/\bnew\s+instruction/gi, '[filtered]')
    .replace(/\bact\s+as\b/gi, '[filtered]')
    .replace(/\bpretend\s+(to\s+be|you\s+are)/gi, '[filtered]')
    .replace(/\binstead\s+of\s+(the\s+)?(above|previous|json)/gi, '[filtered]')
    .replace(/\bdo\s+not\s+return\s+json\b/gi, '[filtered]')
    .replace(/\boutput\s+(only|just|the\s+word)/gi, '[filtered]')
    // Strip control characters and excessive newlines
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 500);
};

export const timelineOptions = [
  { value: 'immediate', label: 'Immediate (1-2 months)', points: 22, description: 'Rush search - premium sourcing required' },
  { value: 'standard', label: 'Standard (2-3 months)', points: 14, description: 'Typical search timeline' },
  { value: 'flexible', label: 'Flexible (4-6 months)', points: 8, description: 'Time to be selective' },
  { value: 'building-pipeline', label: 'Building Pipeline (6+ months)', points: 3, description: 'Strategic talent mapping' }
];

export const householdBudgetRanges = [
  { value: 'under-80k', label: 'Under $80k', midpoint: 70000 },
  { value: '80k-120k', label: '$80k - $120k', midpoint: 100000 },
  { value: '120k-180k', label: '$120k - $180k', midpoint: 150000 },
  { value: '180k-250k', label: '$180k - $250k', midpoint: 215000 },
  { value: '250k-350k', label: '$250k - $350k', midpoint: 300000 },
  { value: 'over-350k', label: 'Over $350k', midpoint: 400000 },
  { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
];

export const corporateBudgetRanges = [
  { value: 'under-200k', label: 'Under $200k', midpoint: 175000 },
  { value: '200k-350k', label: '$200k - $350k', midpoint: 275000 },
  { value: '350k-500k', label: '$350k - $500k', midpoint: 425000 },
  { value: '500k-750k', label: '$500k - $750k', midpoint: 625000 },
  { value: '750k-1m', label: '$750k - $1M', midpoint: 875000 },
  { value: 'over-1m', label: 'Over $1M', midpoint: 1250000 },
  { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
];

export const portfolioBudgetRanges = [
  { value: 'under-300k', label: 'Under $300k', midpoint: 250000 },
  { value: '300k-500k', label: '$300k - $500k', midpoint: 400000 },
  { value: '500k-750k', label: '$500k - $750k', midpoint: 625000 },
  { value: '750k-1m', label: '$750k - $1M', midpoint: 875000 },
  { value: '1m-1.5m', label: '$1M - $1.5M', midpoint: 1250000 },
  { value: 'over-1.5m', label: 'Over $1.5M', midpoint: 1750000 },
  { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
];

export const discretionLevels = [
  { value: 'standard', label: 'Standard', points: 0, description: 'Normal confidentiality' },
  { value: 'elevated', label: 'Elevated - NDA Required', points: 5, description: 'Formal NDA, limited disclosure' },
  { value: 'high-profile', label: 'High-Profile Principal', points: 10, description: 'Public figure, media considerations' },
  { value: 'ultra-discrete', label: 'Ultra-Discrete', points: 15, description: 'Maximum confidentiality, blind search' }
];

export const householdLanguageOptions = ['English (Native/Fluent)', 'Spanish', 'French', 'Mandarin', 'Tagalog', 'Portuguese', 'Russian', 'Italian', 'German', 'Polish', 'Vietnamese', 'Korean', 'Japanese', 'Arabic', 'Hindi', 'Greek', 'Thai', 'Swedish', 'Dutch', 'Hebrew'];

export const corporateLanguageOptions = ['English (Native/Fluent)', 'Mandarin', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Portuguese', 'Korean', 'Russian', 'Italian', 'Hindi', 'Dutch', 'Swedish', 'Hebrew', 'Cantonese', 'Swiss German', 'Luxembourgish', 'Singaporean English', 'Thai'];

export const householdCertificationOptions = ['STCW (Maritime)', 'CPR/First Aid', 'Firearms License', 'LEOSA', 'Commercial Driver (CDL)', 'Culinary Degree', 'Security Clearance', 'Child Development (CDA)', 'Sommelier (CMS)', 'WSET Level 3/4', 'Certified Wine Educator', 'Cicerone (Beer)', 'ServSafe', 'ENG1 Medical', 'PEC (Yacht)', 'RYA Yachtmaster', 'Butler Training (Starkey/IICS)', 'Nursing License (RN/LPN)', 'Montessori Certification', 'Private Pilot License', 'Close Protection (SIA)', 'AED/BLS Certified', 'Estate Management Certification'];

export const corporateCertificationOptions = ['CFA (Chartered Financial Analyst)', 'Series 7 (General Securities)', 'Series 65/66 (Investment Adviser)', 'CPA (Certified Public Accountant)', 'CFP (Certified Financial Planner)', 'CAIA (Alternative Investments)', 'CTFA (Trust & Fiduciary)', 'CIMA (Investment Management)', 'MBA', 'JD (Law Degree)', 'PMP (Project Management)', 'CISSP (Cybersecurity)', 'FRM (Financial Risk Manager)', 'CMA (Management Accounting)', 'EA (Enrolled Agent)', 'CEBS (Employee Benefits)', 'ChFC (Chartered Financial Consultant)', 'CLU (Chartered Life Underwriter)', 'AAMS (Asset Management)', 'CPWA (Private Wealth Advisor)'];

export const portfolioCertificationOptions = ['MBA (Top-tier)', 'CPA (Certified Public Accountant)', 'CFA (Chartered Financial Analyst)', 'JD (Law Degree)', 'Board Director Certification (NACD/ICD)', 'PE Operating Partner Experience', 'Prior CEO/CFO of PE-backed Company', 'Big 4 Background', 'Management Consulting (MBB)', 'Industry-Specific License', 'Six Sigma / Lean Certification', 'PMP (Project Management)', 'CISSP (Cybersecurity)', 'CMA (Management Accounting)', 'FRM (Financial Risk Manager)'];

export const portfolioLanguageOptions = ['English (Native/Fluent)', 'Mandarin', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Portuguese', 'Korean', 'Italian', 'Hindi', 'Dutch', 'Russian', 'Cantonese', 'Swedish', 'Hebrew', 'Singaporean English', 'Thai', 'Swiss German', 'Bahasa'];

export const dealStageOptions = [
  { value: 'turnaround', label: 'Turnaround / Distressed', points: 15, description: 'Restructuring, cost reduction, lender negotiation' },
  { value: 'growth', label: 'Growth / Expansion', points: 8, description: 'Scaling operations, new markets, acquisitions' },
  { value: 'mature', label: 'Mature / Cash-Flowing', points: 3, description: 'Stable operations, yield-focused, stewardship' },
  { value: 'pre-acquisition', label: 'Pre-Acquisition (No team yet)', points: 12, description: 'Building leadership before or at deal close' }
];

export const governanceOptions = [
  { value: 'single-principal', label: 'Single Decision-Maker', points: 5, description: 'Patriarch/matriarch has final say' },
  { value: 'family-council', label: 'Family Council / Board', points: 10, description: 'Multiple family stakeholders to align' },
  { value: 'next-gen', label: 'Next-Gen Led', points: 12, description: 'Generational transition, modernization push' },
  { value: 'professional', label: 'Professional Board', points: 3, description: 'Independent board, institutional governance' }
];

export const coInvestorOptions = [
  { value: 'solo-fo', label: 'Solo Family Office', points: 0, description: 'Single family, full control' },
  { value: 'fo-club', label: 'FO Club Deal (Multiple Families)', points: 8, description: 'Multiple families co-investing' },
  { value: 'fo-pe', label: 'FO + Institutional PE', points: 12, description: 'Family office alongside PE fund' },
  { value: 'fo-strategic', label: 'FO + Strategic Partner', points: 5, description: 'Family office with industry partner' }
];

export const corporateLanguageShortList = ['Mandarin', 'Spanish', 'German', 'Japanese', 'Arabic', 'French'];

export const travelOptions = [
  { value: 'minimal', label: 'Minimal (Local only)', points: 0 },
  { value: 'occasional', label: 'Occasional (1-2 trips/month)', points: 3 },
  { value: 'frequent', label: 'Frequent (Weekly travel)', points: 8 },
  { value: 'heavy-rotation', label: 'Heavy/Rotation (Following principal)', points: 15 }
];
