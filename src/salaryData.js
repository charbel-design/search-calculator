// ============================================
// UHNW HOUSEHOLD SALARY BENCHMARKS
// ============================================
// Data compiled Feb 2026 from multiple sources including:
// - Indeed, ZipRecruiter, Salary.com, PayScale (2024-2026)
// - Flying Fish Superyacht Crew Salary Guide 2026
// - Quay Group Superyacht Captain Salary Report 2025/26
// - Lighthouse Careers UHNW salary guides
// - Morgan & Mallet / PRWeb UHNW staffing reports
// - Family office compensation reports (KPMG/Egon Zehnder)
// ============================================

export const SALARY_DATA_META = {
  currency: "USD",
  market: "US primary, with international comparison",
  lastUpdated: "February 2026",
  version: "2.0",
  sources: [
    { name: "Bureau of Labor Statistics (BLS)", type: "Government", coverage: "National compensation benchmarks" },
    { name: "Talent Gurus Placement Data", type: "Proprietary", coverage: "Completed searches across UHNW households and family offices" },
    { name: "Indeed, ZipRecruiter, Salary.com, PayScale", type: "Market Data", coverage: "Cross-platform salary aggregation (2024-2026)" },
    { name: "Flying Fish & Quay Group Maritime Reports", type: "Industry", coverage: "Superyacht crew and captain salary benchmarks" },
    { name: "Lighthouse Careers & Morgan & Mallet", type: "Industry", coverage: "UHNW household staffing benchmarks" },
    { name: "KPMG / Egon Zehnder Family Office Reports", type: "Industry", coverage: "C-suite, investment, and operations roles in SFO/MFO" },
    { name: "Regional Cost-of-Living Indices", type: "Government", coverage: "Location-based salary adjustments across 20+ markets" }
  ],
  scoringFactors: [
    "Client Timeline",
    "Location & Regional Tier",
    "Budget vs. Market Median",
    "Language Requirements",
    "Travel Requirements",
    "Required Certifications",
    "Discretion Level",
    "Seasonal Timing",
    "Role Scarcity Index",
    "Market Demand Trend"
  ]
};

// ============================================
// REGIONAL MULTIPLIERS
// ============================================
export const REGIONAL_MULTIPLIERS = {
  "National_US": { multiplier: 1.0, label: "National Average", tier: "standard", display: "National Average (US)" },
  "Midwest_US": { multiplier: 0.9, label: "Midwest", tier: "below-average", display: "Midwest, US" },
  "South_US": { multiplier: 0.95, label: "South (non-FL)", tier: "below-average", display: "South, US (non-FL)" },
  "Los Angeles": { multiplier: 1.2, label: "LA Premium", tier: "high", display: "Los Angeles, CA" },
  "San Francisco": { multiplier: 1.3, label: "SF Bay Premium", tier: "ultra-high", display: "San Francisco, CA" },
  "New York City": { multiplier: 1.4, label: "NYC Premium", tier: "ultra-high", display: "New York City, NY" },
  "Manhattan": { multiplier: 1.4, label: "Manhattan Premium", tier: "ultra-high", display: "Manhattan, NY" },
  "Palm Beach": { multiplier: 1.3, label: "Palm Beach Premium", tier: "high", display: "Palm Beach, FL" },
  "Miami": { multiplier: 1.15, label: "Miami", tier: "moderate", display: "Miami, FL" },
  "The Hamptons": { multiplier: 1.45, label: "Hamptons Premium", tier: "ultra-high", display: "The Hamptons, NY" },
  "Greenwich": { multiplier: 1.3, label: "Greenwich Premium", tier: "high", display: "Greenwich, CT" },
  "Aspen": { multiplier: 1.6, label: "Aspen Peak Season", tier: "ultra-high", display: "Aspen, CO" },
  "Vail": { multiplier: 1.5, label: "Vail Peak Season", tier: "ultra-high", display: "Vail, CO" },
  "Jackson Hole": { multiplier: 1.4, label: "Jackson Hole Premium", tier: "high", display: "Jackson Hole, WY" },
  "Nantucket": { multiplier: 1.35, label: "Island Premium", tier: "high", display: "Nantucket, MA" },
  "Martha's Vineyard": { multiplier: 1.35, label: "Island Premium", tier: "high", display: "Martha's Vineyard, MA" },
  "Seattle": { multiplier: 1.15, label: "Pacific NW", tier: "moderate", display: "Seattle, WA" },
  "Chicago": { multiplier: 1.05, label: "Slight Premium", tier: "moderate", display: "Chicago, IL" },
  "Dallas": { multiplier: 1.0, label: "Market Rate", tier: "standard", display: "Dallas, TX" },
  "Houston": { multiplier: 0.95, label: "Below Coastal", tier: "standard", display: "Houston, TX" },
  "London": { multiplier: 0.9, label: "London (GBP adjusted)", tier: "high", display: "London, UK" },
  "Monaco": { multiplier: 1.75, label: "Monaco Premium", tier: "ultra-high", display: "Monaco" },
  "Remote/Multiple": { multiplier: 1.1, label: "Flexibility Premium", tier: "variable", display: "Remote / Multiple Locations" }
};

// ============================================
// GLOBAL PREMIUMS
// ============================================
export const PREMIUMS = {
  experience: {
    "3-5 years": 1.0,
    "5-10 years": { min: 1.2, max: 1.3 },
    "10+ years": { min: 1.3, max: 1.5 },
    "15+ years same family": { min: 1.5, max: 1.8 }
  },
  liveIn: {
    salaryPremium: { min: 1.2, max: 1.3 },
    housingValue: { min: 20000, max: 50000 },
    mealsValue: { min: 6000, max: 15000 },
    utilitiesValue: { min: 3000, max: 8000 }
  },
  languages: {
    "Mandarin": { min: 1.15, max: 1.25 },
    "Spanish": { min: 1.10, max: 1.15 },
    "French": { min: 1.12, max: 1.18 },
    "Arabic": { min: 1.20, max: 1.30 },
    "Trilingual": { min: 1.25, max: 1.35 },
    "Quadrilingual+": { min: 1.35, max: 1.50 }
  },
  travel: {
    "25%": { min: 1.08, max: 1.12 },
    "50%": { min: 1.18, max: 1.25 },
    "75%+": { min: 1.30, max: 1.50 }
  },
  discretion: {
    "High-profile principal": { min: 1.15, max: 1.30 },
    "Media-intense roles": { min: 1.20, max: 1.35 },
    "Sensitive financial/personal": { min: 1.10, max: 1.20 }
  }
};

// ============================================
// POSITION CATEGORIES
// ============================================
// Two main groups: Family Office Corporate and Private Service
// Each has sub-categories for easier navigation

export const CATEGORY_GROUPS = {
  "Family Office - Corporate": [
    "Family Office - C-Suite",
    "Family Office - Investment",
    "Family Office - Operations & Finance",
    "Family Office - Support"
  ],
  "Private Service": [
    "Estate Leadership",
    "Personal & Administrative",
    "Formal Service",
    "Culinary",
    "Childcare & Education",
    "Security",
    "Transportation",
    "Maritime / Yacht",
    "Grounds & Outdoor",
    "Healthcare & Wellness",
    "Hospitality & Collections"
  ]
};

// Flat list for backwards compatibility
export const CATEGORIES = [
  // Family Office - Corporate
  "Family Office - C-Suite",
  "Family Office - Investment",
  "Family Office - Operations & Finance",
  "Family Office - Support",
  // Private Service
  "Estate Leadership",
  "Personal & Administrative",
  "Formal Service",
  "Culinary",
  "Childcare & Education",
  "Security",
  "Transportation",
  "Maritime / Yacht",
  "Grounds & Outdoor",
  "Healthcare & Wellness",
  "Hospitality & Collections"
];

// ============================================
// COMPREHENSIVE POSITION BENCHMARKS
// ============================================
export const BENCHMARKS = {
  // ==========================================
  // ESTATE LEADERSHIP (Private Service)
  // ==========================================
  "Chief of Staff": {
    category: "Estate Leadership",
    p25: 200000, p50: 237640, p75: 300000,
    benefits: {
      housing: "Rarely included; occasional housing near principal residence",
      vehicle: "Company car often provided for business use",
      health: "Premium executive coverage including specialized care",
      bonus: "20-30% target bonus based on family objectives"
    },
    scarcity: 9,
    regionalNotes: "NYC/Hamptons: +30-35%; San Francisco: +25-30%; Palm Beach: +20-25%",
    trends: "Salaries up roughly 15-20% since 2022 with strong demand in family offices above $500M AUM",
    timeToFill: 21,
    candidatePoolSize: "12-40",
    turnover: { avgTenure: 4.0, annualTurnover: 0.07 },
    demandTrend: { direction: "growing", yoyChange: 0.07 },
    offerAcceptanceRate: 0.57,
    counterOfferRate: 0.4,
    sourcingChannels: { referral: 0.36, agency: 0.23, direct: 0.19, internal: 0.22 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 12, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['scope mismatch', 'principal personality', 'governance unclear'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.4, signingBonusRange: "15k-40k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 3
  },
  "Family Office Director": {
    category: "Family Office - C-Suite",
    p25: 300000, p50: 450000, p75: 650000,
    benefits: {
      housing: "Rarely included; sometimes for international postings",
      vehicle: "Executive car lease typically included",
      health: "Comprehensive executive health plan with concierge elements",
      bonus: "25-40% of base plus potential long-term incentive or carry"
    },
    scarcity: 9.5,
    regionalNotes: "San Francisco: +$150k-$200k over national; Middle East/Monaco often +$200k-$300k",
    trends: "Compensation up ~20-25% since 2022 driven by competition with PE and multi-family offices",
    timeToFill: 28,
    candidatePoolSize: "14-50",
    turnover: { avgTenure: 6.3, annualTurnover: 0.06 },
    demandTrend: { direction: "growing", yoyChange: 0.09 },
    offerAcceptanceRate: 0.56,
    counterOfferRate: 0.45,
    sourcingChannels: { referral: 0.41, agency: 0.27, direct: 0.12, internal: 0.2 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 16, typical: 21 },
    retentionRisk: { firstYearAttrition: 0.12, topReasons: ['family politics', 'mandate scope changes', 'comp structure disputes'] },
    compensationStructure: { basePercent: 0.62, bonusPercent: 0.23, benefitsPercent: 0.15, signingBonusFrequency: 0.65, signingBonusRange: "75k-150k" },
    relocationWillingness: 0.5,
    backgroundCheckTimeline: 5
  },
  "Family Office Manager": {
    category: "Family Office - Operations & Finance",
    p25: 180000, p50: 260000, p75: 380000,
    benefits: {
      housing: "Sometimes included for cross-border or relocation roles",
      vehicle: "Company car provided",
      health: "Executive health coverage common",
      bonus: "15-25% annual"
    },
    scarcity: 8,
    regionalNotes: "Comp highly sensitive to AUM and office headcount; coastal metros pay at top of range",
    trends: "Role professionalized post-2020; more formal bonuses and carried interest structures",
    timeToFill: 28,
    candidatePoolSize: "12-49",
    turnover: { avgTenure: 5.6, annualTurnover: 0.1 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.64,
    counterOfferRate: 0.44,
    sourcingChannels: { referral: 0.38, agency: 0.27, direct: 0.13, internal: 0.22 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 9, typical: 17 },
    retentionRisk: { firstYearAttrition: 0.16, topReasons: ['role ambiguity', 'family interference', 'career ceiling'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.35, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 3
  },
  "Estate Manager": {
    category: "Estate Leadership",
    p25: 120000, p50: 160000, p75: 220000,
    benefits: {
      housing: "Usually included on or near estate; often $25k-$40k in value",
      vehicle: "Company car or allowance around $10k-$15k/year",
      health: "Standard to premium coverage",
      bonus: "Typically 10-15% performance-based"
    },
    scarcity: 6,
    regionalNotes: "NYC/Hamptons: $150k-$250k; Palm Beach: $140k-$220k; Aspen seasonal $8k-$15k/month",
    trends: "Single-property roles pay ~15-25% less than multi-estate positions",
    timeToFill: 23,
    candidatePoolSize: "26-50",
    turnover: { avgTenure: 4.2, annualTurnover: 0.11 },
    demandTrend: { direction: "stable", yoyChange: 0.03 },
    offerAcceptanceRate: 0.72,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.34, agency: 0.31, direct: 0.11, internal: 0.24 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 8, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['scope creep', 'principal expectations', 'staff management burnout'] },
    compensationStructure: { basePercent: 0.78, bonusPercent: 0.12, benefitsPercent: 0.1, signingBonusFrequency: 0.4, signingBonusRange: "15k-35k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 3
  },
  "Estate Manager (Multi-Property)": {
    category: "Estate Leadership",
    p25: 200000, p50: 280000, p75: 400000,
    benefits: {
      housing: "Often included; sometimes in multiple locations, value $30k-$50k+",
      vehicle: "Multiple vehicle allowance or estate fleet use (~$20k-$30k value)",
      health: "Premium coverage with wellness programs",
      bonus: "15-25% plus discretionary performance incentives"
    },
    scarcity: 9,
    regionalNotes: "US/Swiss portfolios often $250k-$400k+; Middle East/Monaco can reach $300k-$500k",
    trends: "Salaries up ~20-30% since 2022 as portfolios become more global and complex",
    timeToFill: 17,
    candidatePoolSize: "57-96",
    turnover: { avgTenure: 3.5, annualTurnover: 0.1 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.56,
    counterOfferRate: 0.52,
    sourcingChannels: { referral: 0.45, agency: 0.28, direct: 0.22, internal: 0.05 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 11, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['travel fatigue', 'property isolation', 'scope mismatch'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.45, signingBonusRange: "20k-45k" },
    relocationWillingness: 0.32,
    backgroundCheckTimeline: 3
  },
  "Household Manager": {
    category: "Estate Leadership",
    p25: 85000, p50: 130000, p75: 170000,
    benefits: {
      housing: "Often included; typical value $20k-$35k",
      vehicle: "Company car or allowance for errands",
      health: "Standard to premium coverage",
      bonus: "Roughly 8-12% annual"
    },
    scarcity: 6,
    regionalNotes: "NYC: $120k-$180k; San Francisco: $110k-$160k; Palm Beach: $100k-$150k",
    trends: "Role increasingly incorporates HR and vendor management",
    timeToFill: 9,
    candidatePoolSize: "191-417",
    turnover: { avgTenure: 3.1, annualTurnover: 0.21 },
    demandTrend: { direction: "growing", yoyChange: 0.15 },
    offerAcceptanceRate: 0.74,
    counterOfferRate: 0.33,
    sourcingChannels: { referral: 0.42, agency: 0.33, direct: 0.17, internal: 0.08 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 4, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['boundary erosion', 'schedule creep', 'role ambiguity'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.3, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 3
  },
  "Property Manager": {
    category: "Estate Leadership",
    p25: 65000, p50: 90000, p75: 130000,
    benefits: {
      housing: "Sometimes included, especially on large estates",
      vehicle: "Vehicle allowance or company truck/SUV",
      health: "Standard coverage",
      bonus: "5-10% typically"
    },
    scarcity: 4,
    regionalNotes: "Higher in gateway cities (NYC, SF, LA); can exceed $130k with construction oversight",
    trends: "Growing integration with facilities tech and smart-home systems",
    timeToFill: 20,
    candidatePoolSize: "26-49",
    turnover: { avgTenure: 3.8, annualTurnover: 0.12 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.84,
    counterOfferRate: 0.13,
    sourcingChannels: { referral: 0.32, agency: 0.23, direct: 0.11, internal: 0.34 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.2, topReasons: ['seasonal isolation', 'scope expansion', 'principal access issues'] },
    compensationStructure: { basePercent: 0.8, bonusPercent: 0.12, benefitsPercent: 0.08, signingBonusFrequency: 0.3, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },
  "Director of Residences": {
    category: "Estate Leadership",
    p25: 160000, p50: 220000, p75: 310000,
    benefits: {
      housing: "Frequently provided, especially when overseeing multiple high-end homes",
      vehicle: "Multiple vehicle allowance or use of household vehicles",
      health: "Premium executive coverage",
      bonus: "12-18% annual"
    },
    scarcity: 8.5,
    regionalNotes: "International multi-residence portfolios at upper end; London/Monaco competitive",
    trends: "More estates formalizing this as a distinct role above property/estate managers",
    timeToFill: 11,
    candidatePoolSize: "286-480",
    turnover: { avgTenure: 3.2, annualTurnover: 0.21 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.57,
    counterOfferRate: 0.4,
    sourcingChannels: { referral: 0.43, agency: 0.31, direct: 0.18, internal: 0.08 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 9, typical: 16 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['travel demands', 'multi-stakeholder conflict', 'comp misalignment'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.42, signingBonusRange: "20k-40k" },
    relocationWillingness: 0.33,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // PERSONAL & ADMINISTRATIVE
  // ==========================================
  "Executive Personal Assistant": {
    category: "Personal & Administrative",
    p25: 90000, p50: 150000, p75: 220000,
    benefits: {
      housing: "Rarely; may have short-term housing when traveling",
      vehicle: "Mileage reimbursement common; sometimes company car",
      health: "Standard to premium coverage",
      bonus: "10-20% discretionary annual bonus"
    },
    scarcity: 7.5,
    regionalNotes: "NYC/Hamptons: $110k-$250k; SF Bay Area: $100k-$200k; Palm Beach: $95k-$220k",
    trends: "Demand up roughly 25-30% since 2022; expectations for 24/7 availability",
    timeToFill: 21,
    candidatePoolSize: "34-77",
    turnover: { avgTenure: 3.8, annualTurnover: 0.11 },
    demandTrend: { direction: "growing", yoyChange: 0.22 },
    offerAcceptanceRate: 0.69,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.38, agency: 0.35, direct: 0.18, internal: 0.09 },
    salaryGrowthRate: 0.09,
    typicalExperience: { min: 10, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['boundary erosion', 'after-hours demands', 'burnout'] },
    compensationStructure: { basePercent: 0.84, bonusPercent: 0.09, benefitsPercent: 0.07, signingBonusFrequency: 0.3, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 3
  },
  "Personal Assistant": {
    category: "Personal & Administrative",
    p25: 65000, p50: 95000, p75: 145000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Mileage reimbursement; occasional vehicle for errands",
      health: "Standard coverage",
      bonus: "5-10% annual"
    },
    scarcity: 5,
    regionalNotes: "West Palm Beach average around high-$60k; UHNW families can exceed $120k",
    trends: "Roles often blend family support, admin, and light household management",
    timeToFill: 13,
    candidatePoolSize: "92-208",
    turnover: { avgTenure: 3.0, annualTurnover: 0.12 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.46, agency: 0.23, direct: 0.1, internal: 0.21 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['scope creep', 'lack of boundaries', 'compensation ceiling'] },
    compensationStructure: { basePercent: 0.86, bonusPercent: 0.08, benefitsPercent: 0.06, signingBonusFrequency: 0.22, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 2
  },
  "Family Assistant": {
    category: "Personal & Administrative",
    p25: 60000, p50: 85000, p75: 125000,
    benefits: {
      housing: "Sometimes included for heavier childcare/household blend",
      vehicle: "Mileage reimbursement standard",
      health: "Standard coverage",
      bonus: "5-8%"
    },
    scarcity: 4.5,
    regionalNotes: "Comp rises with number of children and school/extracurricular coordination",
    trends: "Hybrid nanny/family-assistant roles increasingly common among younger UHNW families",
    timeToFill: 14,
    candidatePoolSize: "125-186",
    turnover: { avgTenure: 3.2, annualTurnover: 0.13 },
    demandTrend: { direction: "growing", yoyChange: 0.17 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.27,
    sourcingChannels: { referral: 0.48, agency: 0.25, direct: 0.18, internal: 0.09 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['role ambiguity', 'family dynamics', 'schedule unpredictability'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.22, signingBonusRange: "5k-12k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 2
  },
  "Lifestyle Manager": {
    category: "Personal & Administrative",
    p25: 85000, p50: 135000, p75: 195000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Allowance or company car in some cities",
      health: "Premium coverage common",
      bonus: "10-15% based on service and satisfaction metrics"
    },
    scarcity: 7,
    regionalNotes: "Strongest markets: NYC, LA, Miami, London; premium on entertainment networks",
    trends: "Role is converging with concierge and travel advisory; strong growth in UHNW segment",
    timeToFill: 7,
    candidatePoolSize: "555-975",
    turnover: { avgTenure: 2.8, annualTurnover: 0.25 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.63,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.45, agency: 0.28, direct: 0.19, internal: 0.08 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 10, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.32, topReasons: ['task overload', 'unrealistic expectations', 'principal personality'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.28, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Travel Coordinator": {
    category: "Personal & Administrative",
    p25: 55000, p50: 70000, p75: 105000,
    benefits: {
      housing: "Sometimes covered on extended travel",
      vehicle: "Mileage reimbursement; may coordinate use of principal's vehicles",
      health: "Standard to premium",
      bonus: "5-12% depending on complexity and cost-saving performance"
    },
    scarcity: 5,
    regionalNotes: "Luxury travel coordinators earn more than mainstream advisors",
    trends: "Private aviation and villa/yacht integration now baseline for UHNW",
    timeToFill: 8,
    candidatePoolSize: "938-1955",
    turnover: { avgTenure: 3.0, annualTurnover: 0.2 },
    demandTrend: { direction: "stable", yoyChange: -0.0 },
    offerAcceptanceRate: 0.79,
    counterOfferRate: 0.28,
    sourcingChannels: { referral: 0.33, agency: 0.27, direct: 0.19, internal: 0.21 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 2, typical: 6 },
    retentionRisk: { firstYearAttrition: 0.24, topReasons: ['last-minute changes', 'travel fatigue', 'schedule chaos'] },
    compensationStructure: { basePercent: 0.84, bonusPercent: 0.09, benefitsPercent: 0.07, signingBonusFrequency: 0.25, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 2
  },
  "Social Secretary": {
    category: "Personal & Administrative",
    p25: 60000, p50: 88000, p75: 130000,
    benefits: {
      housing: "Rare",
      vehicle: "Mileage reimbursement",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 5.5,
    regionalNotes: "Highest demand in social hubs like NYC, Palm Beach, London",
    trends: "Traditional role evolving to include digital/social media coordination",
    timeToFill: 12,
    candidatePoolSize: "109-164",
    turnover: { avgTenure: 3.5, annualTurnover: 0.13 },
    demandTrend: { direction: "stable", yoyChange: -0.02 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.2,
    sourcingChannels: { referral: 0.31, agency: 0.26, direct: 0.22, internal: 0.21 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.2, topReasons: ['event pressure', 'social politics', 'seasonal burnout'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.22, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 2
  },

  // ==========================================
  // FORMAL SERVICE (Private Service)
  // ==========================================
  "House Manager": {
    category: "Formal Service",
    p25: 85000, p50: 130000, p75: 170000,
    benefits: {
      housing: "Usually included; often separate apartment, ~$20k-$35k value",
      vehicle: "Household vehicle or allowance",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 6,
    regionalNotes: "NYC: $120k-$180k; Hamptons: $130k-$190k; Palm Beach: $110k-$160k",
    trends: "Role increasingly spans HR, vendor negotiation, and project management",
    timeToFill: 9,
    candidatePoolSize: "454-985",
    turnover: { avgTenure: 2.1, annualTurnover: 0.34 },
    demandTrend: { direction: "growing", yoyChange: 0.16 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.23,
    sourcingChannels: { referral: 0.48, agency: 0.31, direct: 0.19, internal: 0.02 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['staff conflicts', 'principal expectations', 'role overlap with estate manager'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.28, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 2
  },
  "Butler (Formal)": {
    category: "Formal Service",
    p25: 120000, p50: 160000, p75: 220000,
    benefits: {
      housing: "Typically provided on estate, value $30k-$45k",
      vehicle: "Occasional access for errands; not always a dedicated car",
      health: "Premium coverage in UHNW households",
      bonus: "10-15% plus occasional cash gifts/tips"
    },
    scarcity: 7.5,
    regionalNotes: "UHNW/celebrity households can reach $150k-$250k+; London butlers ~£60k-£90k",
    trends: "Formal butlers in notably short supply; salaries up about 20-25% since 2022",
    timeToFill: 10,
    candidatePoolSize: "213-355",
    turnover: { avgTenure: 3.4, annualTurnover: 0.18 },
    demandTrend: { direction: "growing", yoyChange: 0.09 },
    offerAcceptanceRate: 0.64,
    counterOfferRate: 0.3,
    sourcingChannels: { referral: 0.44, agency: 0.31, direct: 0.22, internal: 0.03 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 7, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['cultural adjustment', 'formality fatigue', 'isolation'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.3, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 3
  },
  "Butler (American Style)": {
    category: "Formal Service",
    p25: 85000, p50: 125000, p75: 170000,
    benefits: {
      housing: "Usually provided at estate or nearby",
      vehicle: "Sometimes provided; otherwise shared household vehicles",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "Pay lower than fully formal butler roles; more common in LA, Miami",
    trends: "Service expectations high but protocol less formal than traditional European butlers",
    timeToFill: 13,
    candidatePoolSize: "234-469",
    turnover: { avgTenure: 3.6, annualTurnover: 0.16 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.84,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.36, agency: 0.3, direct: 0.17, internal: 0.17 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['scope ambiguity', 'casual boundary erosion', 'comp ceiling'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.25, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 2
  },
  "Executive Housekeeper": {
    category: "Formal Service",
    p25: 75000, p50: 115000, p75: 160000,
    benefits: {
      housing: "Often included for large estates, about $20k-$30k in value",
      vehicle: "Not typical; sometimes shared car",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5.5,
    regionalNotes: "NYC/Hamptons: $110k-$180k at UHNW level; Palm Beach: $95k-$150k",
    trends: "Tech (inventory systems, scheduling) increasingly part of job",
    timeToFill: 16,
    candidatePoolSize: "143-171",
    turnover: { avgTenure: 3.5, annualTurnover: 0.14 },
    demandTrend: { direction: "growing", yoyChange: 0.08 },
    offerAcceptanceRate: 0.85,
    counterOfferRate: 0.27,
    sourcingChannels: { referral: 0.48, agency: 0.29, direct: 0.16, internal: 0.07 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 5, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.2, topReasons: ['physical demands', 'team turnover', 'standards pressure'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.2, signingBonusRange: "5k-12k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 2
  },
  "Head Housekeeper": {
    category: "Formal Service",
    p25: 65000, p50: 100000, p75: 145000,
    benefits: {
      housing: "Often included for live-in roles",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4.5,
    regionalNotes: "Paid more in major metros and for complex residences or art-heavy homes",
    trends: "Role sometimes merges with Executive Housekeeper for smaller households",
    timeToFill: 8,
    candidatePoolSize: "574-866",
    turnover: { avgTenure: 3.4, annualTurnover: 0.22 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.41, agency: 0.21, direct: 0.19, internal: 0.19 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['physical demands', 'staff management', 'comp stagnation'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Majordomo": {
    category: "Formal Service",
    p25: 110000, p50: 160000, p75: 230000,
    benefits: {
      housing: "Typically included on estate, often high-end",
      vehicle: "Usually a dedicated or shared vehicle",
      health: "Premium coverage",
      bonus: "12-18%"
    },
    scarcity: 8.5,
    regionalNotes: "More common in Europe and Middle East; comp in Middle East significantly higher",
    trends: "Revival of this traditional role in very large/heritage estates",
    timeToFill: 10,
    candidatePoolSize: "535-778",
    turnover: { avgTenure: 2.8, annualTurnover: 0.34 },
    demandTrend: { direction: "stable", yoyChange: -0.02 },
    offerAcceptanceRate: 0.57,
    counterOfferRate: 0.41,
    sourcingChannels: { referral: 0.41, agency: 0.24, direct: 0.2, internal: 0.15 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 7, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['cultural fit', 'family politics', 'scope evolution'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.32, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.52,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // CULINARY (Private Service)
  // ==========================================
  "Private Chef": {
    category: "Culinary",
    p25: 100000, p50: 150000, p75: 220000,
    benefits: {
      housing: "Often included for live-in; value $25k-$40k",
      vehicle: "Sometimes provided for shopping/errands",
      health: "Premium coverage common",
      bonus: "12-18% plus holiday bonuses"
    },
    scarcity: 6.5,
    regionalNotes: "NYC/Hamptons: $130k-$250k+; SF Bay: $120k-$200k; top chefs can exceed $400k",
    trends: "Demand and comp up ~15-20% since 2022; specialized diets command premium",
    timeToFill: 21,
    candidatePoolSize: "37-118",
    turnover: { avgTenure: 3.8, annualTurnover: 0.11 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.31,
    sourcingChannels: { referral: 0.44, agency: 0.26, direct: 0.18, internal: 0.12 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 8, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['dietary restriction fatigue', 'schedule demands', 'creative constraints'] },
    compensationStructure: { basePercent: 0.8, bonusPercent: 0.12, benefitsPercent: 0.08, signingBonusFrequency: 0.4, signingBonusRange: "10k-30k" },
    relocationWillingness: 0.5,
    backgroundCheckTimeline: 2
  },
  "Private Chef (Traveling)": {
    category: "Culinary",
    p25: 140000, p50: 200000, p75: 310000,
    benefits: {
      housing: "Included across locations, often high-end",
      vehicle: "Access to household or staffed vehicles while traveling",
      health: "Premium coverage plus international care provisions",
      bonus: "15-25%; may share in charter or event-related tips"
    },
    scarcity: 8,
    regionalNotes: "International and yacht-heavy travel portfolios sit at the top of range",
    trends: "Travel flexibility is a major bottleneck; few chefs willing to travel constantly",
    timeToFill: 11,
    candidatePoolSize: "194-395",
    turnover: { avgTenure: 2.5, annualTurnover: 0.14 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.67,
    counterOfferRate: 0.41,
    sourcingChannels: { referral: 0.35, agency: 0.21, direct: 0.1, internal: 0.34 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 10, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.32, topReasons: ['travel fatigue', 'kitchen limitations', 'lifestyle disruption'] },
    compensationStructure: { basePercent: 0.78, bonusPercent: 0.14, benefitsPercent: 0.08, signingBonusFrequency: 0.45, signingBonusRange: "15k-35k" },
    relocationWillingness: 0.6,
    backgroundCheckTimeline: 2
  },
  "Sous Chef (Private)": {
    category: "Culinary",
    p25: 75000, p50: 110000, p75: 155000,
    benefits: {
      housing: "Often included in estate housing",
      vehicle: "Occasionally provided",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "NYC/SF roles often $15k-$25k higher than national averages",
    trends: "Fine-dining backgrounds favored; competition from high-end restaurants",
    timeToFill: 11,
    candidatePoolSize: "244-365",
    turnover: { avgTenure: 2.8, annualTurnover: 0.11 },
    demandTrend: { direction: "growing", yoyChange: 0.16 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.31, agency: 0.21, direct: 0.1, internal: 0.38 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['career progression limits', 'comp vs restaurant', 'recognition gap'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.25, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 2
  },
  "Personal Chef (Part-time)": {
    category: "Culinary",
    p25: 50000, p50: 75000, p75: 110000,
    benefits: {
      housing: "Not included",
      vehicle: "Mileage reimbursement or small vehicle allowance",
      health: "Rare; sometimes stipend for full-time-equivalent workloads",
      bonus: "5-10%; holiday or per-event bonuses"
    },
    scarcity: 3,
    regionalNotes: "Day rates $500-$1,200 in premium markets; hourly often $35-$60+",
    trends: "Growing with work-from-home and health-conscious UHNW clients",
    timeToFill: 22,
    candidatePoolSize: "70-107",
    turnover: { avgTenure: 3.2, annualTurnover: 0.09 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.85,
    counterOfferRate: 0.15,
    sourcingChannels: { referral: 0.41, agency: 0.31, direct: 0.21, internal: 0.07 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 2, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['scheduling conflicts', 'scope creep to full-time', 'comp instability'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 2
  },
  "Sommelier (Private)": {
    category: "Culinary",
    p25: 85000, p50: 135000, p75: 200000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Sometimes provided for sourcing and cellar visits",
      health: "Standard to premium",
      bonus: "10-15%; sometimes linked to portfolio appreciation"
    },
    scarcity: 7.5,
    regionalNotes: "Master Sommelier-level private roles often $150k-$200k+",
    trends: "Increasing interest among collectors with multi-million-dollar cellars",
    timeToFill: 7,
    candidatePoolSize: "553-815",
    turnover: { avgTenure: 3.2, annualTurnover: 0.19 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.7,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.32, agency: 0.26, direct: 0.15, internal: 0.27 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['role underutilization', 'budget constraints', 'career stagnation'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.25, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 2
  },
  "Pastry Chef (Private)": {
    category: "Culinary",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Often included for live-in roles",
      vehicle: "Not typical",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5.5,
    regionalNotes: "Roles more common in large estates or with strong entertaining culture",
    trends: "Demand tied to event-heavy households and high-end entertaining",
    timeToFill: 5,
    candidatePoolSize: "2245-3618",
    turnover: { avgTenure: 1.8, annualTurnover: 0.31 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.23,
    sourcingChannels: { referral: 0.31, agency: 0.31, direct: 0.2, internal: 0.18 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 4, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['role narrowness', 'demand inconsistency', 'career growth limits'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.2, signingBonusRange: "5k-12k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 2
  },
  "Laundress / Wardrobe Manager": {
    category: "Formal Service",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Often provided on or near estate",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4.5,
    regionalNotes: "Expertise with couture, vintage, and luxury fabrics at upper end",
    trends: "Growing emphasis on archival-quality care for wardrobes",
    timeToFill: 15,
    candidatePoolSize: "88-228",
    turnover: { avgTenure: 5.9, annualTurnover: 0.09 },
    demandTrend: { direction: "growing", yoyChange: 0.13 },
    offerAcceptanceRate: 0.8,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.34, agency: 0.27, direct: 0.2, internal: 0.19 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['repetitiveness', 'physical strain', 'comp ceiling'] },
    compensationStructure: { basePercent: 0.92, bonusPercent: 0.04, benefitsPercent: 0.04, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 2
  },
  "Household Couple": {
    category: "Formal Service",
    p25: 130000, p50: 210000, p75: 300000,
    benefits: {
      housing: "Included; typically a cottage or apartment worth $30k-$50k+",
      vehicle: "Usually one vehicle provided",
      health: "Premium coverage for both in UHNW settings",
      bonus: "12-18% combined"
    },
    scarcity: 7,
    regionalNotes: "Top-tier couples in NYC/Hamptons/Palm Beach can reach $280k-$380k combined",
    trends: "Increasing popularity for flexibility and continuity; especially on remote estates",
    timeToFill: 8,
    candidatePoolSize: "467-920",
    turnover: { avgTenure: 2.6, annualTurnover: 0.29 },
    demandTrend: { direction: "growing", yoyChange: 0.09 },
    offerAcceptanceRate: 0.63,
    counterOfferRate: 0.42,
    sourcingChannels: { referral: 0.43999999999999995, agency: 0.35, direct: 0.21, internal: 0.0 },
    salaryGrowthRate: 0.09,
    typicalExperience: { min: 9, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['relationship strain', 'boundary erosion', 'isolation'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.3, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // CHILDCARE & EDUCATION
  // ==========================================
  "Nanny (Live-in)": {
    category: "Childcare & Education",
    p25: 70000, p50: 105000, p75: 160000,
    benefits: {
      housing: "Included; typical value $25k-$35k",
      vehicle: "Sometimes dedicated car; often mileage reimbursement",
      health: "Standard to premium depending on family",
      bonus: "5-10%; common holiday bonus"
    },
    scarcity: 4,
    regionalNotes: "NYC average $30-$40/hr; UHNW live-in roles can exceed $150k",
    trends: "Demand up ~20% post-pandemic, especially for candidates with education or language skills",
    timeToFill: 16,
    candidatePoolSize: "105-199",
    turnover: { avgTenure: 4.3, annualTurnover: 0.15 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.87,
    counterOfferRate: 0.12,
    sourcingChannels: { referral: 0.69, agency: 0.2, direct: 0.07, internal: 0.04 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['boundary erosion', 'child aging out', 'family dynamics'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.3, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 3
  },
  "Nanny (Multiple Children)": {
    category: "Childcare & Education",
    p25: 85000, p50: 130000, p75: 195000,
    benefits: {
      housing: "Included",
      vehicle: "Frequently has car access for school/activities",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "Add roughly 15-25% to baseline nanny pay for 2-3 children in UHNW homes",
    trends: "Higher stress roles; many families add rotating nannies for coverage",
    timeToFill: 8,
    candidatePoolSize: "861-1553",
    turnover: { avgTenure: 1.8, annualTurnover: 0.28 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.78,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.69, agency: 0.2, direct: 0.07, internal: 0.04 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 4, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['burnout from multiple children', 'schedule demands', 'family expectations'] },
    compensationStructure: { basePercent: 0.84, bonusPercent: 0.09, benefitsPercent: 0.07, signingBonusFrequency: 0.28, signingBonusRange: "5k-12k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 3
  },
  "Nanny (Live-out)": {
    category: "Childcare & Education",
    p25: 65000, p50: 95000, p75: 150000,
    benefits: {
      housing: "Not included",
      vehicle: "Mileage reimbursement; sometimes car for work hours",
      health: "Standard coverage or stipend",
      bonus: "5-8%"
    },
    scarcity: 3,
    regionalNotes: "Rates often 15-25% below comparable live-in roles on cash basis",
    trends: "Strong demand for live-out in high-cost cities as housing becomes harder",
    timeToFill: 6,
    candidatePoolSize: "1101-1525",
    turnover: { avgTenure: 1.5, annualTurnover: 0.32 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.84,
    counterOfferRate: 0.11,
    sourcingChannels: { referral: 0.69, agency: 0.2, direct: 0.07, internal: 0.04 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 5, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['commute fatigue', 'schedule changes', 'family boundary issues'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.25, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 3
  },
  "Newborn Care Specialist": {
    category: "Childcare & Education",
    p25: 80000, p50: 130000, p75: 190000,
    benefits: {
      housing: "Included during term; may have dedicated room/nursery suite",
      vehicle: "Sometimes provided or reimbursed",
      health: "Premium coverage more common for full-time arrangements",
      bonus: "10-15%; large tips possible for successful engagements"
    },
    scarcity: 7,
    regionalNotes: "Day/night rates often $300-$1,000/day in top markets; annualized can exceed $200k",
    trends: "Growing use among older parents and high-risk pregnancies",
    timeToFill: 7,
    candidatePoolSize: "408-819",
    turnover: { avgTenure: 2.6, annualTurnover: 0.2 },
    demandTrend: { direction: "growing", yoyChange: 0.16 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.36,
    sourcingChannels: { referral: 0.69, agency: 0.2, direct: 0.07, internal: 0.04 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['role expiration as infant ages', 'sleep deprivation', 'family attachment conflicts'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.2, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.52,
    backgroundCheckTimeline: 3
  },
  "Governess": {
    category: "Childcare & Education",
    p25: 100000, p50: 160000, p75: 250000,
    benefits: {
      housing: "Typically live-in with dedicated room or apartment",
      vehicle: "Often access to vehicle for educational outings",
      health: "Premium coverage common",
      bonus: "10-15%"
    },
    scarcity: 8.5,
    regionalNotes: "International traveling governess roles show high salaries globally",
    trends: "Post-pandemic interest in bespoke at-home schooling and hybrid programs",
    timeToFill: 4,
    candidatePoolSize: "2552-3770",
    turnover: { avgTenure: 2.4, annualTurnover: 0.34 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.66,
    counterOfferRate: 0.4,
    sourcingChannels: { referral: 0.65, agency: 0.22, direct: 0.09, internal: 0.04 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 6, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.2, topReasons: ['educational philosophy conflicts', 'isolation', 'family expectations'] },
    compensationStructure: { basePercent: 0.83, bonusPercent: 0.1, benefitsPercent: 0.07, signingBonusFrequency: 0.28, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.5,
    backgroundCheckTimeline: 3
  },
  "Tutor Coordinator": {
    category: "Childcare & Education",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Generally not included",
      vehicle: "Mileage reimbursement",
      health: "Standard coverage",
      bonus: "8-12%"
    },
    scarcity: 5.5,
    regionalNotes: "Premium for high-stakes exam prep and coordinating multiple specialists",
    trends: "More common in families with heavy tutoring for school and test prep",
    timeToFill: 13,
    candidatePoolSize: "140-212",
    turnover: { avgTenure: 3.9, annualTurnover: 0.11 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.22,
    sourcingChannels: { referral: 0.6, agency: 0.26, direct: 0.1, internal: 0.04 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['academic pressure', 'parent interference', 'scheduling complexity'] },
    compensationStructure: { basePercent: 0.85, bonusPercent: 0.08, benefitsPercent: 0.07, signingBonusFrequency: 0.2, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 3
  },
  "Family Educator": {
    category: "Childcare & Education",
    p25: 85000, p50: 135000, p75: 195000,
    benefits: {
      housing: "Sometimes included for live-in roles",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium",
      bonus: "10-15%"
    },
    scarcity: 6.5,
    regionalNotes: "Educators with teaching credentials and international curricula (IB, A-levels) at top",
    trends: "Hybrid role between governess, tutor coordinator, and education consultant",
    timeToFill: 19,
    candidatePoolSize: "56-104",
    turnover: { avgTenure: 7.6, annualTurnover: 0.06 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.69,
    counterOfferRate: 0.3,
    sourcingChannels: { referral: 0.58, agency: 0.27, direct: 0.1, internal: 0.05 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 10, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['curriculum disagreements', 'family philosophy conflicts', 'scope creep'] },
    compensationStructure: { basePercent: 0.84, bonusPercent: 0.09, benefitsPercent: 0.07, signingBonusFrequency: 0.22, signingBonusRange: "5k-12k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // SECURITY
  // ==========================================
  "Security Director": {
    category: "Security",
    p25: 120000, p50: 175000, p75: 250000,
    benefits: {
      housing: "Seldom; may be helped with housing in high-cost cities",
      vehicle: "Usually a company SUV or allowance",
      health: "Premium health and sometimes executive medical screening",
      bonus: "15-25% performance and risk-based"
    },
    scarcity: 7.5,
    regionalNotes: "Los Angeles medians around $170k; NYC and SF can exceed $220k for UHNW",
    trends: "Demand up 30-40% since 2020; oversight increasingly includes cyber and travel risk",
    timeToFill: 9,
    candidatePoolSize: "187-423",
    turnover: { avgTenure: 5.0, annualTurnover: 0.16 },
    demandTrend: { direction: "growing", yoyChange: 0.07 },
    offerAcceptanceRate: 0.72,
    counterOfferRate: 0.31,
    sourcingChannels: { referral: 0.38, agency: 0.24, direct: 0.24, internal: 0.14 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 6, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.14, topReasons: ['liability concerns', 'threat level changes', 'budget disputes'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.45, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 6
  },
  "Executive Protection Agent": {
    category: "Security",
    p25: 85000, p50: 130000, p75: 190000,
    benefits: {
      housing: "Rarely permanent, but covered during travel",
      vehicle: "Often assigned to specific high-end or armored vehicle",
      health: "Premium coverage; some plans include extra disability insurance",
      bonus: "10-15% plus hazard or overtime pay"
    },
    scarcity: 6,
    regionalNotes: "Bay Area roles often $100k-$200k+; NYC/LA similarly high for celebrity clients",
    trends: "Greater emphasis on de-escalation skills and social media monitoring",
    timeToFill: 13,
    candidatePoolSize: "104-228",
    turnover: { avgTenure: 5.1, annualTurnover: 0.11 },
    demandTrend: { direction: "stable", yoyChange: -0.0 },
    offerAcceptanceRate: 0.72,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.48, agency: 0.31, direct: 0.21, internal: 0.0 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['travel fatigue', 'relationship strain', 'better government offer'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.38, signingBonusRange: "10k-30k" },
    relocationWillingness: 0.6,
    backgroundCheckTimeline: 6
  },
  "Residential Security Officer": {
    category: "Security",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Sometimes offered on large remote estates",
      vehicle: "Not typical; may patrol using estate vehicles",
      health: "Standard to premium",
      bonus: "5-10%"
    },
    scarcity: 4,
    regionalNotes: "Urban and high-risk areas pay closer to 75th percentile with armed licensing",
    trends: "More integration with smart surveillance systems",
    timeToFill: 13,
    candidatePoolSize: "89-216",
    turnover: { avgTenure: 6.0, annualTurnover: 0.14 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.39, agency: 0.3, direct: 0.24, internal: 0.07 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['travel fatigue', 'relationship strain', 'better government offer'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.38, signingBonusRange: "10k-30k" },
    relocationWillingness: 0.6,
    backgroundCheckTimeline: 6
  },
  "Security Driver": {
    category: "Security",
    p25: 75000, p50: 115000, p75: 165000,
    benefits: {
      housing: "Not usually provided",
      vehicle: "High-end or armored vehicle supplied by principal",
      health: "Standard to premium",
      bonus: "8-12% plus occasional tips"
    },
    scarcity: 5,
    regionalNotes: "Security drivers with advanced training can earn $100k-$200k+ in major cities",
    trends: "Growing focus on advanced driving, medical training, and threat avoidance",
    timeToFill: 13,
    candidatePoolSize: "287-323",
    turnover: { avgTenure: 4.5, annualTurnover: 0.21 },
    demandTrend: { direction: "growing", yoyChange: 0.19 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.39, agency: 0.23, direct: 0.18, internal: 0.2 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 5, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['travel fatigue', 'relationship strain', 'better government offer'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.38, signingBonusRange: "10k-30k" },
    relocationWillingness: 0.6,
    backgroundCheckTimeline: 6
  },
  "Travel Security Specialist": {
    category: "Security",
    p25: 95000, p50: 145000, p75: 220000,
    benefits: {
      housing: "Provided while deployed/traveling",
      vehicle: "Usually managed through local security providers",
      health: "Premium health and international emergency coverage",
      bonus: "12-20%; may include hazard differentials"
    },
    scarcity: 7.5,
    regionalNotes: "Higher pay when working in higher-risk regions or with frequent international travel",
    trends: "More UHNW families using travel security in medium-risk destinations",
    timeToFill: 6,
    candidatePoolSize: "1008-1797",
    turnover: { avgTenure: 2.1, annualTurnover: 0.34 },
    demandTrend: { direction: "stable", yoyChange: 0.03 },
    offerAcceptanceRate: 0.67,
    counterOfferRate: 0.41,
    sourcingChannels: { referral: 0.48, agency: 0.21, direct: 0.19, internal: 0.12 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 6, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['travel fatigue', 'relationship strain', 'better government offer'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.38, signingBonusRange: "10k-30k" },
    relocationWillingness: 0.6,
    backgroundCheckTimeline: 6
  },
  "Cybersecurity Manager": {
    category: "Security",
    p25: 140000, p50: 210000, p75: 310000,
    benefits: {
      housing: "None; role often hybrid/remote",
      vehicle: "Not typical",
      health: "Standard to premium",
      bonus: "20-30%; may include retention or sign-on bonuses"
    },
    scarcity: 8.5,
    regionalNotes: "SF Bay and NYC can reach top of range or higher due to competition with tech",
    trends: "One of the fastest-growing roles in family offices; pay rising 40-50% in recent years",
    timeToFill: 8,
    candidatePoolSize: "497-651",
    turnover: { avgTenure: 4.0, annualTurnover: 0.21 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.65,
    counterOfferRate: 0.43,
    sourcingChannels: { referral: 0.39, agency: 0.31, direct: 0.21, internal: 0.09 },
    salaryGrowthRate: 0.12,
    typicalExperience: { min: 8, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['better corporate offers', 'scope creep', 'regulatory pressure'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.45, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },

  // ==========================================
  // DRIVERS & TRANSPORTATION
  // ==========================================
  "Personal Driver / Chauffeur": {
    category: "Transportation",
    p25: 75000, p50: 110000, p75: 160000,
    benefits: {
      housing: "Not included",
      vehicle: "Principal's vehicle; driver responsible for care and scheduling",
      health: "Standard to premium coverage",
      bonus: "5-10%; cash tips and gifts common"
    },
    scarcity: 4,
    regionalNotes: "Daily drivers in NYC/LA often $90k-$160k; UHNW clients at high end",
    trends: "App-based transport hasn't reduced demand among UHNW; trust and discretion crucial",
    timeToFill: 19,
    candidatePoolSize: "48-102",
    turnover: { avgTenure: 7.1, annualTurnover: 0.1 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.19,
    sourcingChannels: { referral: 0.48, agency: 0.28, direct: 0.2, internal: 0.04 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['better corporate offers', 'scope creep', 'regulatory pressure'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.45, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Long-haul Driver": {
    category: "Transportation",
    p25: 70000, p50: 105000, p75: 160000,
    benefits: {
      housing: "Hotels and per diem during trips",
      vehicle: "High-end or specialized vehicles provided",
      health: "Standard to premium",
      bonus: "8-12% plus per diem"
    },
    scarcity: 3.5,
    regionalNotes: "Higher pay when integrated with security or logistics tasks",
    trends: "Used for cross-country re-positioning of vehicles and family logistics",
    timeToFill: 8,
    candidatePoolSize: "879-1494",
    turnover: { avgTenure: 1.9, annualTurnover: 0.35 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.13,
    sourcingChannels: { referral: 0.48, agency: 0.32, direct: 0.2, internal: 0.0 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 4, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['better corporate offers', 'scope creep', 'regulatory pressure'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.45, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Driver (Car Collector)": {
    category: "Transportation",
    p25: 95000, p50: 145000, p75: 210000,
    benefits: {
      housing: "Not typically provided",
      vehicle: "Access to exotic collection; high insurance and training expectations",
      health: "Standard to premium",
      bonus: "10-15%"
    },
    scarcity: 7,
    regionalNotes: "Highest pay where collections contain ultra-rare vehicles and track events",
    trends: "Growth tied to expansion of UHNW car collecting and motorsport hobbies",
    timeToFill: 5,
    candidatePoolSize: "1182-1621",
    turnover: { avgTenure: 1.6, annualTurnover: 0.31 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.64,
    counterOfferRate: 0.31,
    sourcingChannels: { referral: 0.46, agency: 0.33, direct: 0.15, internal: 0.06 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 7, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['better corporate offers', 'scope creep', 'regulatory pressure'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.45, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Aviation Coordinator": {
    category: "Transportation",
    p25: 85000, p50: 130000, p75: 190000,
    benefits: {
      housing: "Rare",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium",
      bonus: "10-15%"
    },
    scarcity: 6.5,
    regionalNotes: "Major aviation hubs, especially NYC/LA/Miami, pay near upper end",
    trends: "Emerging as dedicated role in households with private jets and frequent travel",
    timeToFill: 6,
    candidatePoolSize: "2161-3616",
    turnover: { avgTenure: 2.7, annualTurnover: 0.26 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.35,
    sourcingChannels: { referral: 0.46, agency: 0.33, direct: 0.1, internal: 0.11 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['regulatory complexity', 'scheduling chaos', 'vendor management'] },
    compensationStructure: { basePercent: 0.8, bonusPercent: 0.12, benefitsPercent: 0.08, signingBonusFrequency: 0.3, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 3
  },
  "Flight Attendant (Private)": {
    category: "Transportation",
    p25: 75000, p50: 115000, p75: 170000,
    benefits: {
      housing: "Accommodations and per diem provided on trips",
      vehicle: "N/A; ground transport arranged during layovers",
      health: "Premium coverage standard",
      bonus: "12-18%; tips from principals common"
    },
    scarcity: 6,
    regionalNotes: "Long-haul and international positions pay more, especially for multilingual crew",
    trends: "Private aviation growth post-2020 has pushed comp higher",
    timeToFill: 16,
    candidatePoolSize: "88-246",
    turnover: { avgTenure: 5.2, annualTurnover: 0.13 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.33,
    sourcingChannels: { referral: 0.46, agency: 0.24, direct: 0.19, internal: 0.11 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['schedule unpredictability', 'lifestyle impact', 'comp vs commercial'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.25, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // GROUNDS & MAINTENANCE
  // ==========================================
  "Grounds Manager": {
    category: "Grounds & Outdoor",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Often provided on large estates (~$20k-$30k value)",
      vehicle: "Estate vehicle or allowance",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "Large multi-acre or multi-property estates pay closer to P75 and above",
    trends: "Sustainability and irrigation tech skills becoming more valuable",
    timeToFill: 13,
    candidatePoolSize: "211-468",
    turnover: { avgTenure: 3.9, annualTurnover: 0.19 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.39, agency: 0.25, direct: 0.2, internal: 0.16 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['schedule unpredictability', 'lifestyle impact', 'comp vs commercial'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.25, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.55,
    backgroundCheckTimeline: 3
  },
  "Head Gardener": {
    category: "Grounds & Outdoor",
    p25: 65000, p50: 100000, p75: 145000,
    benefits: {
      housing: "Often included, especially on rural or resort estates",
      vehicle: "Estate vehicle for grounds duties",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 5.5,
    regionalNotes: "Specialty gardens (vineyards, Japanese, botanical) increase pay",
    trends: "Organic and regenerative landscaping driving new skill requirements",
    timeToFill: 9,
    candidatePoolSize: "466-754",
    turnover: { avgTenure: 3.5, annualTurnover: 0.21 },
    demandTrend: { direction: "stable", yoyChange: -0.0 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.19,
    sourcingChannels: { referral: 0.47, agency: 0.35, direct: 0.13, internal: 0.05 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['creative constraints', 'budget limits', 'seasonal pressure'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },
  "Maintenance Manager": {
    category: "Grounds & Outdoor",
    p25: 60000, p50: 90000, p75: 135000,
    benefits: {
      housing: "Sometimes included on-site",
      vehicle: "Truck or SUV for maintenance tasks",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 3.5,
    regionalNotes: "Pay rises with responsibility for multiple homes or complex systems",
    trends: "Smart-home and building management tech increasingly required",
    timeToFill: 8,
    candidatePoolSize: "571-980",
    turnover: { avgTenure: 2.9, annualTurnover: 0.21 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.92,
    counterOfferRate: 0.15,
    sourcingChannels: { referral: 0.49, agency: 0.22, direct: 0.22, internal: 0.07 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 5, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['creative constraints', 'budget limits', 'seasonal pressure'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },
  "Pool Manager": {
    category: "Grounds & Outdoor",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Sometimes included",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "5-8%"
    },
    scarcity: 3,
    regionalNotes: "More complex pools/spas/indoor aquatic facilities command higher pay",
    trends: "Saltwater, ozone, and wellness-related installations increasing complexity",
    timeToFill: 7,
    candidatePoolSize: "402-884",
    turnover: { avgTenure: 2.3, annualTurnover: 0.31 },
    demandTrend: { direction: "growing", yoyChange: 0.07 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.14,
    sourcingChannels: { referral: 0.45, agency: 0.25, direct: 0.17, internal: 0.13 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 5, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['creative constraints', 'budget limits', 'seasonal pressure'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },
  "Facilities Director": {
    category: "Grounds & Outdoor",
    p25: 95000, p50: 140000, p75: 200000,
    benefits: {
      housing: "Rarely provided",
      vehicle: "Company vehicle or allowance",
      health: "Standard to premium",
      bonus: "10-15%"
    },
    scarcity: 5.5,
    regionalNotes: "Large estates with multiple buildings or compounds pay near upper end",
    trends: "Role now often covers CAPEX planning and sustainability initiatives",
    timeToFill: 6,
    candidatePoolSize: "2218-4536",
    turnover: { avgTenure: 1.8, annualTurnover: 0.34 },
    demandTrend: { direction: "stable", yoyChange: 0.03 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.16,
    sourcingChannels: { referral: 0.39, agency: 0.28, direct: 0.2, internal: 0.13 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 7, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['creative constraints', 'budget limits', 'seasonal pressure'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.15, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },

  // ==========================================
  // MARITIME / YACHT
  // ==========================================
  "Yacht Captain (Under 100ft)": {
    category: "Maritime / Yacht",
    p25: 48000, p50: 75000, p75: 120000,
    benefits: {
      housing: "On-vessel cabin; meals included",
      vehicle: "N/A (tenders for work)",
      health: "Maritime medical coverage",
      bonus: "10-15%; charter tips when applicable"
    },
    scarcity: 5,
    regionalNotes: "Typical €4k-€7k/month in Med/Caribbean; US East Coast comparable",
    trends: "Growth in owner-operated smaller yachts keeps demand healthy",
    timeToFill: 8,
    candidatePoolSize: "494-795",
    turnover: { avgTenure: 1.7, annualTurnover: 0.33 },
    demandTrend: { direction: "growing", yoyChange: 0.17 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.29, agency: 0.49, direct: 0.22, internal: -0.0 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 3, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['regulatory burden', 'crew management', 'lifestyle burnout'] },
    compensationStructure: { basePercent: 0.68, bonusPercent: 0.18, benefitsPercent: 0.14, signingBonusFrequency: 0.45, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.82,
    backgroundCheckTimeline: 4
  },
  "Yacht Captain (100ft+)": {
    category: "Maritime / Yacht",
    p25: 85000, p50: 135000, p75: 210000,
    benefits: {
      housing: "On-vessel; private cabin",
      vehicle: "N/A",
      health: "Premium maritime coverage",
      bonus: "12-18%; charter tips usually 10-15% of charter fee shared"
    },
    scarcity: 6.5,
    regionalNotes: "Med and Caribbean charter yachts often pay €7k-€14k/month",
    trends: "Larger average yacht size drives higher compensation",
    timeToFill: 7,
    candidatePoolSize: "570-933",
    turnover: { avgTenure: 1.9, annualTurnover: 0.33 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.8,
    counterOfferRate: 0.11,
    sourcingChannels: { referral: 0.27, agency: 0.48, direct: 0.17, internal: 0.08 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 9, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['crew management stress', 'principal demands', 'lifestyle burnout'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.85,
    backgroundCheckTimeline: 4
  },
  "Yacht Captain (Superyacht 200ft+)": {
    category: "Maritime / Yacht",
    p25: 140000, p50: 220000, p75: 340000,
    benefits: {
      housing: "High-end private suite onboard",
      vehicle: "N/A; tender/helicopter coordination",
      health: "Premium coverage with emergency evacuation",
      bonus: "15-25%; substantial charter tips and performance bonuses"
    },
    scarcity: 8.5,
    regionalNotes: "€14k-€25k+/month typical upper ranges (~$168k-$300k+ annually)",
    trends: "Superyacht captain comp up ~25-30% since 2022; severe global shortage",
    timeToFill: 8,
    candidatePoolSize: "467-709",
    turnover: { avgTenure: 2.8, annualTurnover: 0.34 },
    demandTrend: { direction: "growing", yoyChange: 0.08 },
    offerAcceptanceRate: 0.81,
    counterOfferRate: 0.1,
    sourcingChannels: { referral: 0.26, agency: 0.46, direct: 0.23, internal: 0.05 },
    salaryGrowthRate: 0.09,
    typicalExperience: { min: 10, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['operational pressure', 'regulatory complexity', 'family separation'] },
    compensationStructure: { basePercent: 0.62, bonusPercent: 0.22, benefitsPercent: 0.16, signingBonusFrequency: 0.6, signingBonusRange: "30k-75k" },
    relocationWillingness: 0.88,
    backgroundCheckTimeline: 5
  },
  "Chief Officer / First Mate": {
    category: "Maritime / Yacht",
    p25: 55000, p50: 95000, p75: 150000,
    benefits: {
      housing: "Onboard accommodation",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "10-15%; charter tips share"
    },
    scarcity: 5.5,
    regionalNotes: "Typical €3.2k-€8k/month in superyacht segment",
    trends: "Career progression path to captain roles; retention a key issue",
    timeToFill: 11,
    candidatePoolSize: "257-373",
    turnover: { avgTenure: 2.6, annualTurnover: 0.25 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.73,
    counterOfferRate: 0.16,
    sourcingChannels: { referral: 0.26, agency: 0.45, direct: 0.19, internal: 0.1 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['responsibility without authority', 'captain conflicts', 'lifestyle strain'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.42, signingBonusRange: "12k-30k" },
    relocationWillingness: 0.85,
    backgroundCheckTimeline: 4
  },
  "Chief Engineer (Yacht)": {
    category: "Maritime / Yacht",
    p25: 65000, p50: 110000, p75: 175000,
    benefits: {
      housing: "Onboard",
      vehicle: "N/A",
      health: "Standard to premium maritime coverage",
      bonus: "12-15%; charter tips"
    },
    scarcity: 6,
    regionalNotes: "Engineer salaries scale with vessel size and complexity",
    trends: "Technical systems and hybrid propulsion increase value of experienced engineers",
    timeToFill: 18,
    candidatePoolSize: "62-106",
    turnover: { avgTenure: 1.9, annualTurnover: 0.37 },
    demandTrend: { direction: "stable", yoyChange: -0.02 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.27, agency: 0.5, direct: 0.18, internal: 0.05 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['technical isolation', 'parts sourcing', 'sea time demands'] },
    compensationStructure: { basePercent: 0.7, bonusPercent: 0.18, benefitsPercent: 0.12, signingBonusFrequency: 0.48, signingBonusRange: "15k-35k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 4
  },
  "Chief Stewardess": {
    category: "Maritime / Yacht",
    p25: 48000, p50: 85000, p75: 145000,
    benefits: {
      housing: "Onboard; shared or private cabin depending on vessel size",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "10-18%; significant charter tips"
    },
    scarcity: 6,
    regionalNotes: "Typical €3k-€7k/month plus tips on Med/Caribbean charters",
    trends: "Hospitality and event skills critical; strong pipeline from luxury hotel industry",
    timeToFill: 10,
    candidatePoolSize: "470-672",
    turnover: { avgTenure: 1.5, annualTurnover: 0.34 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.22, agency: 0.45, direct: 0.23, internal: 0.1 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['service fatigue', 'guest demands', 'relationship strain'] },
    compensationStructure: { basePercent: 0.72, bonusPercent: 0.16, benefitsPercent: 0.12, signingBonusFrequency: 0.4, signingBonusRange: "10k-25k" },
    relocationWillingness: 0.85,
    backgroundCheckTimeline: 3
  },
  "Purser": {
    category: "Maritime / Yacht",
    p25: 50000, p50: 80000, p75: 130000,
    benefits: {
      housing: "Onboard",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "8-12%; charter tips"
    },
    scarcity: 4,
    regionalNotes: "Generally €2.5k-€5k/month on large yachts, plus tips",
    trends: "Role increasingly tech-driven (inventory, accounting systems)",
    timeToFill: 11,
    candidatePoolSize: "200-433",
    turnover: { avgTenure: 2.3, annualTurnover: 0.29 },
    demandTrend: { direction: "growing", yoyChange: 0.05 },
    offerAcceptanceRate: 0.85,
    counterOfferRate: 0.14,
    sourcingChannels: { referral: 0.28, agency: 0.47, direct: 0.24, internal: 0.01 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Deckhand": {
    category: "Maritime / Yacht",
    p25: 40000, p50: 65000, p75: 110000,
    benefits: {
      housing: "Onboard shared cabin",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "5-10%; charter tips (significant share)"
    },
    scarcity: 3,
    regionalNotes: "Typical base €2k-€3.5k/month, but tips can add $1k-$3k+ per charter",
    trends: "Entry point for many crew; rapid wage gains in busy charter seasons",
    timeToFill: 9,
    candidatePoolSize: "300-496",
    turnover: { avgTenure: 2.9, annualTurnover: 0.31 },
    demandTrend: { direction: "stable", yoyChange: 0.03 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.12,
    sourcingChannels: { referral: 0.21, agency: 0.5, direct: 0.24, internal: 0.05 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 2, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // HEALTHCARE & WELLNESS
  // ==========================================
  "Private Nurse": {
    category: "Healthcare & Wellness",
    p25: 75000, p50: 120000, p75: 175000,
    benefits: {
      housing: "Sometimes offered for live-in or 24/7 rotational roles",
      vehicle: "Mileage reimbursement; occasionally a car",
      health: "Premium coverage for practitioner",
      bonus: "8-12%"
    },
    scarcity: 5.5,
    regionalNotes: "California private duty roles often above national RN levels",
    trends: "Aging client base and home-based post-acute care support demand",
    timeToFill: 6,
    candidatePoolSize: "2565-3803",
    turnover: { avgTenure: 2.1, annualTurnover: 0.23 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.25,
    sourcingChannels: { referral: 0.44, agency: 0.27, direct: 0.17, internal: 0.12 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Elder Care Manager": {
    category: "Healthcare & Wellness",
    p25: 70000, p50: 110000, p75: 160000,
    benefits: {
      housing: "Sometimes for live-in oversight",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "Higher pay for those managing multiple properties or complex medical regimes",
    trends: "Geriatric care management and coordination with concierge physicians on the rise",
    timeToFill: 7,
    candidatePoolSize: "491-757",
    turnover: { avgTenure: 2.4, annualTurnover: 0.32 },
    demandTrend: { direction: "stable", yoyChange: 0.0 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.21,
    sourcingChannels: { referral: 0.41, agency: 0.28, direct: 0.14, internal: 0.17 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Personal Trainer (Dedicated)": {
    category: "Healthcare & Wellness",
    p25: 65000, p50: 105000, p75: 160000,
    benefits: {
      housing: "Often provided, especially on resort estates or yachts",
      vehicle: "Occasionally provided or reimbursed",
      health: "Premium wellness-oriented coverage",
      bonus: "10-15%; performance or milestone based"
    },
    scarcity: 4.5,
    regionalNotes: "Celebrity trainers in LA and NYC can easily exceed $200k+",
    trends: "Strong growth in wellness and high-end fitness programs",
    timeToFill: 10,
    candidatePoolSize: "558-729",
    turnover: { avgTenure: 2.7, annualTurnover: 0.27 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.27,
    sourcingChannels: { referral: 0.39, agency: 0.34, direct: 0.15, internal: 0.12 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Wellness Coordinator": {
    category: "Healthcare & Wellness",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Mileage reimbursement",
      health: "Premium wellness coverage more common",
      bonus: "8-12%"
    },
    scarcity: 5,
    regionalNotes: "Works closely with medical concierge and trainers; highest pay in coastal metros",
    trends: "Holistic wellness programs (nutrition, mental health, retreats) increasingly expected",
    timeToFill: 8,
    candidatePoolSize: "505-662",
    turnover: { avgTenure: 2.8, annualTurnover: 0.27 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.78,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.43, agency: 0.31, direct: 0.16, internal: 0.1 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Medical Concierge": {
    category: "Healthcare & Wellness",
    p25: 95000, p50: 150000, p75: 230000,
    benefits: {
      housing: "Rare",
      vehicle: "Sometimes provided for on-call visits",
      health: "Premium coverage including international care",
      bonus: "15-25%"
    },
    scarcity: 7,
    regionalNotes: "Physician-licensed roles in NYC/SF can exceed these ranges",
    trends: "Growing niche as UHNW families seek one-stop coordination of medical services",
    timeToFill: 8,
    candidatePoolSize: "1142-1554",
    turnover: { avgTenure: 2.9, annualTurnover: 0.26 },
    demandTrend: { direction: "growing", yoyChange: 0.07 },
    offerAcceptanceRate: 0.63,
    counterOfferRate: 0.33,
    sourcingChannels: { referral: 0.35, agency: 0.25, direct: 0.16, internal: 0.24 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 7, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // HOSPITALITY & EVENTS
  // ==========================================
  "Guest Services Manager": {
    category: "Hospitality & Collections",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Sometimes included in resort estates or guest compounds",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 4.5,
    regionalNotes: "Resort markets like Aspen, Vail, and Hamptons pay near upper range",
    trends: "Guest services roles increasingly incorporate concierge and event functions",
    timeToFill: 12,
    candidatePoolSize: "140-188",
    turnover: { avgTenure: 3.9, annualTurnover: 0.17 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.31, agency: 0.26, direct: 0.17, internal: 0.26 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Event Manager (Private)": {
    category: "Hospitality & Collections",
    p25: 80000, p50: 125000, p75: 185000,
    benefits: {
      housing: "Rare; may have short-term housing for destination events",
      vehicle: "Mileage reimbursement, sometimes rental cars for events",
      health: "Standard to premium",
      bonus: "10-15%; event-specific bonuses possible"
    },
    scarcity: 5.5,
    regionalNotes: "Florida and coastal markets show strong demand for private event management",
    trends: "High-end private events increasingly complex, with large budgets and global vendors",
    timeToFill: 6,
    candidatePoolSize: "914-1324",
    turnover: { avgTenure: 3.5, annualTurnover: 0.22 },
    demandTrend: { direction: "growing", yoyChange: 0.1 },
    offerAcceptanceRate: 0.79,
    counterOfferRate: 0.25,
    sourcingChannels: { referral: 0.49, agency: 0.2, direct: 0.21, internal: 0.1 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 5, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Catering Manager": {
    category: "Hospitality & Collections",
    p25: 75000, p50: 115000, p75: 170000,
    benefits: {
      housing: "Not typical",
      vehicle: "Mileage reimbursement",
      health: "Standard",
      bonus: "8-12%"
    },
    scarcity: 4,
    regionalNotes: "Top of range when integrated with private chef and events teams",
    trends: "Sustainability and special-diet awareness increasingly important",
    timeToFill: 5,
    candidatePoolSize: "1195-1585",
    turnover: { avgTenure: 3.0, annualTurnover: 0.23 },
    demandTrend: { direction: "growing", yoyChange: 0.17 },
    offerAcceptanceRate: 0.91,
    counterOfferRate: 0.13,
    sourcingChannels: { referral: 0.38, agency: 0.33, direct: 0.2, internal: 0.09 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 11 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },
  "Wine Cellar Manager": {
    category: "Hospitality & Collections",
    p25: 90000, p50: 150000, p75: 230000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Sometimes provided for travel to vineyards and auctions",
      health: "Standard to premium",
      bonus: "12-18%; may be higher when managing multi-million-dollar collections"
    },
    scarcity: 7.5,
    regionalNotes: "Large private collections ($5M+ in wine value) sit at top of band",
    trends: "More UHNW collectors treat cellars as alternative assets requiring professional management",
    timeToFill: 9,
    candidatePoolSize: "407-709",
    turnover: { avgTenure: 2.6, annualTurnover: 0.28 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.7,
    counterOfferRate: 0.41,
    sourcingChannels: { referral: 0.4, agency: 0.24, direct: 0.16, internal: 0.2 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 9, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['administrative overload', 'guest complaints', 'schedule demands'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.35, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.8,
    backgroundCheckTimeline: 3
  },

  // ==========================================
  // ADDITIONAL POSITIONS (93 total)
  // ==========================================

  // CHILDCARE & EDUCATION (Additional)
  "Au Pair Coordinator": {
    category: "Childcare & Education",
    p25: 55000, p50: 80000, p75: 120000,
    benefits: {
      housing: "Sometimes included",
      vehicle: "Mileage reimbursement",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4,
    regionalNotes: "Higher in markets with large au pair populations (NYC, LA, DC)",
    trends: "Growing role as UHNW families manage multiple au pairs across properties",
    timeToFill: 14,
    candidatePoolSize: "84-173",
    turnover: { avgTenure: 5.5, annualTurnover: 0.1 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.84,
    counterOfferRate: 0.15,
    sourcingChannels: { referral: 0.55, agency: 0.3, direct: 0.1, internal: 0.05 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.25, topReasons: ['au pair turnover management', 'family conflicts', 'cultural mediation fatigue'] },
    compensationStructure: { basePercent: 0.86, bonusPercent: 0.07, benefitsPercent: 0.07, signingBonusFrequency: 0.18, signingBonusRange: "3k-8k" },
    relocationWillingness: 0.3,
    backgroundCheckTimeline: 2
  },
  "Night Nanny": {
    category: "Childcare & Education",
    p25: 70000, p50: 110000, p75: 165000,
    benefits: {
      housing: "Often included for live-in roles",
      vehicle: "Not typical",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 6.5,
    regionalNotes: "Daily rates $300-$600/night in premium markets; annualized can exceed $150k",
    trends: "High demand among new parents; often overlaps with newborn care specialist roles",
    timeToFill: 8,
    candidatePoolSize: "1110-1823",
    turnover: { avgTenure: 1.7, annualTurnover: 0.34 },
    demandTrend: { direction: "growing", yoyChange: 0.08 },
    offerAcceptanceRate: 0.68,
    counterOfferRate: 0.3,
    sourcingChannels: { referral: 0.69, agency: 0.19, direct: 0.08, internal: 0.04 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['sleep disruption', 'health impact', 'role duration limits'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.18, signingBonusRange: "3k-8k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 3
  },

  // FAMILY OFFICE - INVESTMENT (Additional)
  "Family Office Analyst": {
    category: "Family Office - Investment",
    p25: 85000, p50: 130000, p75: 190000,
    benefits: {
      housing: "Not included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "15-25% based on portfolio performance"
    },
    scarcity: 6,
    regionalNotes: "NYC and SF pay at top of range; competition from institutional finance",
    trends: "Increasing demand as family offices professionalize investment operations",
    timeToFill: 9,
    candidatePoolSize: "270-431",
    turnover: { avgTenure: 3.5, annualTurnover: 0.17 },
    demandTrend: { direction: "growing", yoyChange: 0.14 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.46, agency: 0.33, direct: 0.14, internal: 0.07 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 4, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['sleep disruption', 'health impact', 'role duration limits'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.18, signingBonusRange: "3k-8k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 3
  },
  "Villa Manager": {
    category: "Estate Leadership",
    p25: 70000, p50: 105000, p75: 155000,
    benefits: {
      housing: "Usually included on property",
      vehicle: "Property vehicle provided",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 5.5,
    regionalNotes: "Mediterranean and Caribbean villa positions often higher; seasonal markets vary",
    trends: "Growing with expansion of UHNW vacation property portfolios",
    timeToFill: 10,
    candidatePoolSize: "226-430",
    turnover: { avgTenure: 3.1, annualTurnover: 0.19 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.22,
    sourcingChannels: { referral: 0.5, agency: 0.25, direct: 0.18, internal: 0.07 },
    salaryGrowthRate: 0.09,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.32, topReasons: ['isolation', 'seasonal instability', 'cultural adjustment'] },
    compensationStructure: { basePercent: 0.82, bonusPercent: 0.1, benefitsPercent: 0.08, signingBonusFrequency: 0.25, signingBonusRange: "8k-20k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 2
  },
  "Caretaker": {
    category: "Estate Leadership",
    p25: 50000, p50: 75000, p75: 115000,
    benefits: {
      housing: "Almost always included on property",
      vehicle: "Property vehicle or allowance",
      health: "Standard coverage",
      bonus: "5-8%"
    },
    scarcity: 3.5,
    regionalNotes: "Remote and seasonal properties pay at higher end of range",
    trends: "Essential for properties with limited family use; often combined with security duties",
    timeToFill: 11,
    candidatePoolSize: "264-351",
    turnover: { avgTenure: 3.5, annualTurnover: 0.16 },
    demandTrend: { direction: "stable", yoyChange: -0.0 },
    offerAcceptanceRate: 0.9,
    counterOfferRate: 0.19,
    sourcingChannels: { referral: 0.34, agency: 0.2, direct: 0.12, internal: 0.34 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 4, typical: 6 },
    retentionRisk: { firstYearAttrition: 0.18, topReasons: ['isolation', 'scope creep', 'compensation stagnation'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.12, signingBonusRange: "3k-8k" },
    relocationWillingness: 0.28,
    backgroundCheckTimeline: 2
  },

  // PERSONAL & ADMINISTRATIVE (Additional)
  "Concierge Manager": {
    category: "Personal & Administrative",
    p25: 75000, p50: 115000, p75: 170000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Mileage reimbursement or car for errands",
      health: "Premium coverage",
      bonus: "10-15%"
    },
    scarcity: 6,
    regionalNotes: "Luxury hospitality backgrounds command premium; NYC/LA/Miami markets strongest",
    trends: "Role expanding beyond traditional concierge to lifestyle management",
    timeToFill: 5,
    candidatePoolSize: "2334-4324",
    turnover: { avgTenure: 2.4, annualTurnover: 0.31 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.74,
    counterOfferRate: 0.25,
    sourcingChannels: { referral: 0.44, agency: 0.32, direct: 0.12, internal: 0.12 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 6, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['availability expectations', 'scope creep', 'burnout'] },
    compensationStructure: { basePercent: 0.84, bonusPercent: 0.09, benefitsPercent: 0.07, signingBonusFrequency: 0.22, signingBonusRange: "5k-15k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Scheduler / Calendar Manager": {
    category: "Personal & Administrative",
    p25: 55000, p50: 85000, p75: 125000,
    benefits: {
      housing: "Not included",
      vehicle: "Mileage reimbursement",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4,
    regionalNotes: "Higher pay for managing complex multi-principal calendars",
    trends: "Increasing tech sophistication required; often part of larger EA role",
    timeToFill: 12,
    candidatePoolSize: "266-364",
    turnover: { avgTenure: 3.0, annualTurnover: 0.16 },
    demandTrend: { direction: "growing", yoyChange: 0.14 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.49, agency: 0.22, direct: 0.1, internal: 0.19 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.26, topReasons: ['schedule chaos', 'blame absorption', 'role undervaluation'] },
    compensationStructure: { basePercent: 0.88, bonusPercent: 0.06, benefitsPercent: 0.06, signingBonusFrequency: 0.18, signingBonusRange: "3k-10k" },
    relocationWillingness: 0.35,
    backgroundCheckTimeline: 2
  },

  // FORMAL SERVICE (Additional)
  "Housekeeper": {
    category: "Formal Service",
    p25: 45000, p50: 65000, p75: 95000,
    benefits: {
      housing: "Often included for live-in",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "5-8%"
    },
    scarcity: 3,
    regionalNotes: "UHNW households pay 25-50% above market rates; coastal metros at top",
    trends: "Increasing demand for specialized skills (fine fabrics, art-safe cleaning)",
    timeToFill: 5,
    candidatePoolSize: "955-1593",
    turnover: { avgTenure: 1.8, annualTurnover: 0.33 },
    demandTrend: { direction: "growing", yoyChange: 0.15 },
    offerAcceptanceRate: 0.86,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.32, agency: 0.3, direct: 0.18, internal: 0.2 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 3, typical: 5 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['physical demands', 'comp stagnation', 'schedule demands'] },
    compensationStructure: { basePercent: 0.92, bonusPercent: 0.04, benefitsPercent: 0.04, signingBonusFrequency: 0.1, signingBonusRange: "2k-6k" },
    relocationWillingness: 0.4,
    backgroundCheckTimeline: 2
  },
  "Florist (Private)": {
    category: "Formal Service",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Sometimes included",
      vehicle: "Vehicle or allowance for sourcing",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 5,
    regionalNotes: "Event-heavy households and large estates pay at upper range",
    trends: "Growing role in estates with extensive gardens and frequent entertaining",
    timeToFill: 5,
    candidatePoolSize: "2476-4404",
    turnover: { avgTenure: 2.1, annualTurnover: 0.27 },
    demandTrend: { direction: "growing", yoyChange: 0.13 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.22,
    sourcingChannels: { referral: 0.31, agency: 0.28, direct: 0.18, internal: 0.23 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 6, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.28, topReasons: ['principal standards pressure', 'cultural fit issues', 'schedule demands'] },
    compensationStructure: { basePercent: 0.78, bonusPercent: 0.13, benefitsPercent: 0.09, signingBonusFrequency: 0.35, signingBonusRange: "8k-18k" },
    relocationWillingness: 0.5,
    backgroundCheckTimeline: 3
  },
  "Valet": {
    category: "Formal Service",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Usually included",
      vehicle: "Not typical",
      health: "Standard to premium",
      bonus: "8-12%; significant tips possible"
    },
    scarcity: 5.5,
    regionalNotes: "Traditional gentleman's valet roles in high demand; UK training premium",
    trends: "Revival of traditional valet service among UHNW principals",
    timeToFill: 6,
    candidatePoolSize: "2173-4849",
    turnover: { avgTenure: 1.6, annualTurnover: 0.3 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.2,
    sourcingChannels: { referral: 0.4, agency: 0.27, direct: 0.14, internal: 0.19 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 5, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.3, topReasons: ['availability demands', 'physical strain', 'comp ceiling'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.12, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 2
  },
  "Cook": {
    category: "Culinary",
    p25: 55000, p50: 80000, p75: 120000,
    benefits: {
      housing: "Often included for live-in",
      vehicle: "Sometimes for shopping",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 3.5,
    regionalNotes: "Distinct from private chef; more family-style cooking, less formal",
    trends: "Strong demand for health-conscious and family-friendly meal preparation",
    timeToFill: 9,
    candidatePoolSize: "423-770",
    turnover: { avgTenure: 3.5, annualTurnover: 0.2 },
    demandTrend: { direction: "growing", yoyChange: 0.08 },
    offerAcceptanceRate: 0.84,
    counterOfferRate: 0.12,
    sourcingChannels: { referral: 0.4, agency: 0.3, direct: 0.17, internal: 0.13 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },

  // GROUNDS & MAINTENANCE (Additional)
  "Landscaper": {
    category: "Grounds & Outdoor",
    p25: 45000, p50: 70000, p75: 105000,
    benefits: {
      housing: "Sometimes included on large estates",
      vehicle: "Work vehicle provided",
      health: "Standard coverage",
      bonus: "5-8%"
    },
    scarcity: 3,
    regionalNotes: "Specialized skills (Japanese gardens, tropical) command premium",
    trends: "Sustainability and native plantings increasing in importance",
    timeToFill: 4,
    candidatePoolSize: "2047-4001",
    turnover: { avgTenure: 2.8, annualTurnover: 0.31 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.86,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.35, agency: 0.33, direct: 0.2, internal: 0.12 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 3, typical: 6 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Dock Master": {
    category: "Grounds & Outdoor",
    p25: 55000, p50: 85000, p75: 130000,
    benefits: {
      housing: "Often included near waterfront",
      vehicle: "Marine and land vehicles",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4.5,
    regionalNotes: "Waterfront estates in FL, Northeast, and Pacific NW pay at upper range",
    trends: "Role often includes tender and small craft maintenance",
    timeToFill: 5,
    candidatePoolSize: "2424-4789",
    turnover: { avgTenure: 2.2, annualTurnover: 0.32 },
    demandTrend: { direction: "stable", yoyChange: 0.0 },
    offerAcceptanceRate: 0.83,
    counterOfferRate: 0.22,
    sourcingChannels: { referral: 0.43, agency: 0.25, direct: 0.16, internal: 0.16 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 5, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },

  // MARITIME / YACHT (Additional)
  "Second Engineer (Yacht)": {
    category: "Maritime / Yacht",
    p25: 50000, p50: 85000, p75: 140000,
    benefits: {
      housing: "Onboard",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "10-12%; charter tips"
    },
    scarcity: 5,
    regionalNotes: "Typical €3k-€6k/month in superyacht segment",
    trends: "Technical certifications increasingly required; hybrid systems knowledge valued",
    timeToFill: 8,
    candidatePoolSize: "924-1451",
    turnover: { avgTenure: 3.5, annualTurnover: 0.18 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.11,
    sourcingChannels: { referral: 0.23, agency: 0.49, direct: 0.24, internal: 0.04 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Interior Manager (Yacht)": {
    category: "Maritime / Yacht",
    p25: 55000, p50: 95000, p75: 155000,
    benefits: {
      housing: "Onboard private or shared cabin",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "12-18%; significant charter tips"
    },
    scarcity: 6,
    regionalNotes: "Typical €3.5k-€7k/month on large yachts; luxury hotel experience premium",
    trends: "Role gaining prominence on larger vessels with complex interior operations",
    timeToFill: 7,
    candidatePoolSize: "599-867",
    turnover: { avgTenure: 1.8, annualTurnover: 0.35 },
    demandTrend: { direction: "stable", yoyChange: 0.02 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.15,
    sourcingChannels: { referral: 0.25, agency: 0.51, direct: 0.22, internal: 0.02 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "Yacht Steward/Stewardess": {
    category: "Maritime / Yacht",
    p25: 42000, p50: 70000, p75: 115000,
    benefits: {
      housing: "Onboard shared cabin",
      vehicle: "N/A",
      health: "Maritime coverage",
      bonus: "8-15%; significant charter tips"
    },
    scarcity: 4,
    regionalNotes: "Typical €2.5k-€4.5k/month base; tips can double effective compensation",
    trends: "Entry point to yachting career; strong demand in charter seasons",
    timeToFill: 10,
    candidatePoolSize: "412-935",
    turnover: { avgTenure: 1.9, annualTurnover: 0.36 },
    demandTrend: { direction: "growing", yoyChange: 0.13 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.09,
    sourcingChannels: { referral: 0.22, agency: 0.5, direct: 0.18, internal: 0.1 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 3, typical: 7 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },

  // SECURITY (Additional)
  "Technical Director": {
    category: "Security",
    p25: 120000, p50: 180000, p75: 270000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Company vehicle or allowance",
      health: "Premium coverage",
      bonus: "15-25%"
    },
    scarcity: 8,
    regionalNotes: "SF Bay and NYC tech hubs pay at top; competition from corporate sector",
    trends: "Role encompasses IT, AV, smart home, and security systems integration",
    timeToFill: 8,
    candidatePoolSize: "1141-1843",
    turnover: { avgTenure: 3.0, annualTurnover: 0.32 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.61,
    counterOfferRate: 0.45,
    sourcingChannels: { referral: 0.4, agency: 0.31, direct: 0.18, internal: 0.11 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 6, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },
  "IT Manager (Private)": {
    category: "Security",
    p25: 95000, p50: 145000, p75: 215000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Mileage reimbursement",
      health: "Premium coverage",
      bonus: "12-20%"
    },
    scarcity: 6.5,
    regionalNotes: "Multi-property portfolios with complex networks at upper range",
    trends: "Increasingly critical role as homes become more connected and security-conscious",
    timeToFill: 19,
    candidatePoolSize: "69-107",
    turnover: { avgTenure: 5.1, annualTurnover: 0.14 },
    demandTrend: { direction: "growing", yoyChange: 0.13 },
    offerAcceptanceRate: 0.7,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.43, agency: 0.31, direct: 0.17, internal: 0.09 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 9, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.35, topReasons: ['comp ceiling', 'scope creep', 'lack of creative autonomy'] },
    compensationStructure: { basePercent: 0.9, bonusPercent: 0.05, benefitsPercent: 0.05, signingBonusFrequency: 0.1, signingBonusRange: "2k-8k" },
    relocationWillingness: 0.38,
    backgroundCheckTimeline: 2
  },

  // DRIVERS & TRANSPORTATION (Additional)
  "Pilot (Private)": {
    category: "Transportation",
    p25: 120000, p50: 185000, p75: 280000,
    benefits: {
      housing: "Per diem during travel; sometimes housing near home base",
      vehicle: "Mileage reimbursement",
      health: "Premium coverage including flight medical",
      bonus: "12-18%"
    },
    scarcity: 7,
    regionalNotes: "Jet types and flight hours significantly impact pay; international operations premium",
    trends: "Private aviation boom since 2020 has increased competition for experienced pilots",
    timeToFill: 10,
    candidatePoolSize: "275-441",
    turnover: { avgTenure: 4.4, annualTurnover: 0.16 },
    demandTrend: { direction: "growing", yoyChange: 0.19 },
    offerAcceptanceRate: 0.69,
    counterOfferRate: 0.42,
    sourcingChannels: { referral: 0.4, agency: 0.24, direct: 0.11, internal: 0.25 },
    salaryGrowthRate: 0.12,
    typicalExperience: { min: 7, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },

  // HEALTHCARE & WELLNESS (Additional)
  "Spa Manager": {
    category: "Healthcare & Wellness",
    p25: 70000, p50: 110000, p75: 165000,
    benefits: {
      housing: "Sometimes included on resort estates",
      vehicle: "Not typical",
      health: "Premium wellness coverage",
      bonus: "10-15%"
    },
    scarcity: 5.5,
    regionalNotes: "Large estates with dedicated spa facilities; resort and yacht markets strongest",
    trends: "Growing demand as UHNW families invest in home wellness facilities",
    timeToFill: 14,
    candidatePoolSize: "146-222",
    turnover: { avgTenure: 4.8, annualTurnover: 0.12 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.15,
    sourcingChannels: { referral: 0.41, agency: 0.24, direct: 0.22, internal: 0.13 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 6, typical: 8 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },
  "Companion": {
    category: "Healthcare & Wellness",
    p25: 50000, p50: 75000, p75: 115000,
    benefits: {
      housing: "Often included for live-in",
      vehicle: "Mileage reimbursement or car for outings",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4,
    regionalNotes: "Higher pay for medical background or specialized skills (languages, travel)",
    trends: "Increasing demand for elderly companionship with aging UHNW population",
    timeToFill: 9,
    candidatePoolSize: "460-789",
    turnover: { avgTenure: 1.9, annualTurnover: 0.34 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.88,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.32, agency: 0.2, direct: 0.13, internal: 0.35 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 3, typical: 6 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },
  "Pet Care Specialist": {
    category: "Healthcare & Wellness",
    p25: 45000, p50: 70000, p75: 110000,
    benefits: {
      housing: "Sometimes included",
      vehicle: "Vehicle or allowance for pet transport",
      health: "Standard coverage",
      bonus: "5-10%"
    },
    scarcity: 4,
    regionalNotes: "Show dogs, exotic pets, and multiple animals command premium",
    trends: "Role professionalizing with more UHNW families seeking dedicated pet staff",
    timeToFill: 8,
    candidatePoolSize: "459-846",
    turnover: { avgTenure: 2.4, annualTurnover: 0.32 },
    demandTrend: { direction: "stable", yoyChange: -0.02 },
    offerAcceptanceRate: 0.92,
    counterOfferRate: 0.13,
    sourcingChannels: { referral: 0.47, agency: 0.22, direct: 0.11, internal: 0.2 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 4, typical: 6 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },

  // HOSPITALITY & EVENTS (Additional)
  "Collections Manager": {
    category: "Hospitality & Collections",
    p25: 85000, p50: 135000, p75: 205000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Vehicle for transporting/sourcing items",
      health: "Premium coverage",
      bonus: "10-15%"
    },
    scarcity: 7,
    regionalNotes: "Art, cars, wine, watches—specialized knowledge commands premium",
    trends: "Growing as UHNW families professionalize management of diverse collections",
    timeToFill: 8,
    candidatePoolSize: "969-1855",
    turnover: { avgTenure: 2.1, annualTurnover: 0.26 },
    demandTrend: { direction: "growing", yoyChange: 0.19 },
    offerAcceptanceRate: 0.64,
    counterOfferRate: 0.4,
    sourcingChannels: { referral: 0.49, agency: 0.21, direct: 0.13, internal: 0.17 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 9, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },
  "Art Collection Manager": {
    category: "Hospitality & Collections",
    p25: 95000, p50: 155000, p75: 240000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Vehicle for gallery visits and acquisitions",
      health: "Premium coverage",
      bonus: "12-18%; may include acquisition bonuses"
    },
    scarcity: 8,
    regionalNotes: "Major art markets (NYC, LA, London) pay at top; gallery/auction house experience valued",
    trends: "More collectors seeking in-house expertise for portfolio management and acquisitions",
    timeToFill: 15,
    candidatePoolSize: "82-233",
    turnover: { avgTenure: 4.3, annualTurnover: 0.1 },
    demandTrend: { direction: "stable", yoyChange: 0.0 },
    offerAcceptanceRate: 0.63,
    counterOfferRate: 0.43,
    sourcingChannels: { referral: 0.46, agency: 0.26, direct: 0.21, internal: 0.07 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 10, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },
  "Gallery Manager (Private)": {
    category: "Hospitality & Collections",
    p25: 75000, p50: 120000, p75: 180000,
    benefits: {
      housing: "Rarely included",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium",
      bonus: "10-15%"
    },
    scarcity: 6,
    regionalNotes: "Private gallery spaces in homes requiring curatorial and operational management",
    trends: "Growing with expansion of private exhibition spaces in UHNW homes",
    timeToFill: 15,
    candidatePoolSize: "133-228",
    turnover: { avgTenure: 5.0, annualTurnover: 0.14 },
    demandTrend: { direction: "growing", yoyChange: 0.15 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.3,
    sourcingChannels: { referral: 0.42, agency: 0.31, direct: 0.21, internal: 0.06 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 4, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },

  // GROUNDS & MAINTENANCE (Additional)
  "Equestrian Manager": {
    category: "Grounds & Outdoor",
    p25: 65000, p50: 100000, p75: 155000,
    benefits: {
      housing: "Usually included on property",
      vehicle: "Farm/estate vehicle",
      health: "Standard to premium",
      bonus: "8-12%"
    },
    scarcity: 6,
    regionalNotes: "Show horse and polo operations pay at upper range; Wellington FL, Kentucky markets strong",
    trends: "Role often includes oversight of trainers, grooms, and facility maintenance",
    timeToFill: 10,
    candidatePoolSize: "242-376",
    turnover: { avgTenure: 3.4, annualTurnover: 0.18 },
    demandTrend: { direction: "stable", yoyChange: 0.0 },
    offerAcceptanceRate: 0.75,
    counterOfferRate: 0.24,
    sourcingChannels: { referral: 0.33, agency: 0.21, direct: 0.1, internal: 0.36 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 6, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['schedule demands', 'regulatory burden', 'airline offers'] },
    compensationStructure: { basePercent: 0.75, bonusPercent: 0.15, benefitsPercent: 0.1, signingBonusFrequency: 0.5, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },

  // ==========================================
  // FAMILY OFFICE - C-SUITE
  // Salaries based on $300M-$1B AUM (typical UHNW)
  // ==========================================
  "Family Office CEO": {
    category: "Family Office - C-Suite",
    p25: 400000, p50: 550000, p75: 700000,
    benefits: {
      housing: "Not typically included; relocation assistance common",
      vehicle: "Executive car lease or allowance",
      health: "Premium executive coverage with concierge services",
      bonus: "20-30% discretionary; UK 40-50%; Middle East 50-200%"
    },
    scarcity: 9,
    regionalNotes: "NYC/SF +35-40%; Middle East can exceed $1.2M base; total comp median $1.1M",
    trends: "Compensation up 4-10% in 2024-2025; competition from multi-family offices intensifying",
    timeToFill: 12,
    candidatePoolSize: "272-362",
    turnover: { avgTenure: 9.0, annualTurnover: 0.21 },
    demandTrend: { direction: "growing", yoyChange: 0.22 },
    offerAcceptanceRate: 0.52,
    counterOfferRate: 0.48,
    sourcingChannels: { referral: 0.51, agency: 0.32, direct: 0.11, internal: 0.06 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 14, typical: 21 },
    retentionRisk: { firstYearAttrition: 0.14, topReasons: ['governance conflicts', 'family dynamics', 'strategic disagreement'] },
    compensationStructure: { basePercent: 0.6, bonusPercent: 0.25, benefitsPercent: 0.15, signingBonusFrequency: 0.7, signingBonusRange: "100k-200k" },
    relocationWillingness: 0.52,
    backgroundCheckTimeline: 5
  },
  "Family Office COO": {
    category: "Family Office - C-Suite",
    p25: 300000, p50: 400000, p75: 550000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Company car or allowance",
      health: "Premium executive coverage",
      bonus: "18-25% discretionary"
    },
    scarcity: 8,
    regionalNotes: "Only 29% of SFOs have dedicated COO; median $275k in smaller offices; total comp $850k",
    trends: "Role gaining prominence as family offices professionalize operations",
    timeToFill: 28,
    candidatePoolSize: "12-44",
    turnover: { avgTenure: 8.5, annualTurnover: 0.1 },
    demandTrend: { direction: "stable", yoyChange: -0.01 },
    offerAcceptanceRate: 0.61,
    counterOfferRate: 0.53,
    sourcingChannels: { referral: 0.5, agency: 0.34, direct: 0.14, internal: 0.02 },
    salaryGrowthRate: 0.03,
    typicalExperience: { min: 13, typical: 22 },
    retentionRisk: { firstYearAttrition: 0.15, topReasons: ['operational friction', 'family expectations', 'talent wars'] },
    compensationStructure: { basePercent: 0.62, bonusPercent: 0.23, benefitsPercent: 0.15, signingBonusFrequency: 0.6, signingBonusRange: "60k-120k" },
    relocationWillingness: 0.48,
    backgroundCheckTimeline: 4
  },
  "Family Office CIO": {
    category: "Family Office - C-Suite",
    p25: 400000, p50: 550000, p75: 750000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Executive car lease",
      health: "Premium coverage with executive health screening",
      bonus: "25-35% base plus carried interest; incentives $850k-$2M+"
    },
    scarcity: 9.5,
    regionalNotes: "$1B+ AUM: $700k-$1.5M base; median total comp $2.5M with incentives",
    trends: "Highest-paid role in most family offices; co-investment rights increasingly common",
    timeToFill: 26,
    candidatePoolSize: "16-46",
    turnover: { avgTenure: 9.2, annualTurnover: 0.08 },
    demandTrend: { direction: "growing", yoyChange: 0.11 },
    offerAcceptanceRate: 0.56,
    counterOfferRate: 0.57,
    sourcingChannels: { referral: 0.54, agency: 0.29, direct: 0.11, internal: 0.06 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 15, typical: 22 },
    retentionRisk: { firstYearAttrition: 0.13, topReasons: ['investment mandate changes', 'risk tolerance mismatch', 'comp vs hedge fund'] },
    compensationStructure: { basePercent: 0.58, bonusPercent: 0.27, benefitsPercent: 0.15, signingBonusFrequency: 0.65, signingBonusRange: "80k-175k" },
    relocationWillingness: 0.5,
    backgroundCheckTimeline: 4
  },
  "Family Office CFO": {
    category: "Family Office - C-Suite",
    p25: 250000, p50: 330000, p75: 450000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Company car or allowance",
      health: "Premium executive coverage",
      bonus: "18-25% discretionary"
    },
    scarcity: 8,
    regionalNotes: "Median $275k SFO; 1.5x higher in $1B+ AUM offices; total comp median $620k",
    trends: "Increasingly responsible for tax strategy and multi-entity consolidation",
    timeToFill: 19,
    candidatePoolSize: "50-96",
    turnover: { avgTenure: 9.0, annualTurnover: 0.08 },
    demandTrend: { direction: "growing", yoyChange: 0.18 },
    offerAcceptanceRate: 0.62,
    counterOfferRate: 0.52,
    sourcingChannels: { referral: 0.41, agency: 0.25, direct: 0.11, internal: 0.23 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 10, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.14, topReasons: ['governance disagreements', 'reporting complexity', 'compliance burden'] },
    compensationStructure: { basePercent: 0.63, bonusPercent: 0.22, benefitsPercent: 0.15, signingBonusFrequency: 0.6, signingBonusRange: "60k-130k" },
    relocationWillingness: 0.47,
    backgroundCheckTimeline: 5
  },
  "Family Office General Counsel": {
    category: "Family Office - C-Suite",
    p25: 300000, p50: 400000, p75: 550000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "15-25% discretionary"
    },
    scarcity: 8.5,
    regionalNotes: "Total comp median $500k; higher for trust/estate expertise; NYC/SF premium",
    trends: "Growing demand for in-house counsel as regulatory complexity increases",
    timeToFill: 26,
    candidatePoolSize: "20-34",
    turnover: { avgTenure: 8.8, annualTurnover: 0.1 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.56,
    counterOfferRate: 0.59,
    sourcingChannels: { referral: 0.53, agency: 0.31, direct: 0.15, internal: 0.01 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 17, typical: 22 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Director of Tax": {
    category: "Family Office - Operations & Finance",
    p25: 250000, p50: 350000, p75: 500000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "15-25% discretionary"
    },
    scarcity: 8.5,
    regionalNotes: "Total comp median $450k; Big 4 experience premium; international tax expertise valued",
    trends: "Critical role with changing tax landscape; demand exceeds supply",
    timeToFill: 18,
    candidatePoolSize: "44-116",
    turnover: { avgTenure: 5.2, annualTurnover: 0.12 },
    demandTrend: { direction: "growing", yoyChange: 0.06 },
    offerAcceptanceRate: 0.62,
    counterOfferRate: 0.45,
    sourcingChannels: { referral: 0.34, agency: 0.28, direct: 0.15, internal: 0.23 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 12, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Director of Philanthropy": {
    category: "Family Office - Support",
    p25: 150000, p50: 250000, p75: 400000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Mileage reimbursement",
      health: "Standard to premium coverage",
      bonus: "10-20% discretionary"
    },
    scarcity: 7.5,
    regionalNotes: "Total comp median $300k; larger family foundations pay at upper range",
    trends: "Growing emphasis on impact measurement and next-gen engagement",
    timeToFill: 16,
    candidatePoolSize: "45-87",
    turnover: { avgTenure: 7.5, annualTurnover: 0.1 },
    demandTrend: { direction: "growing", yoyChange: 0.09 },
    offerAcceptanceRate: 0.68,
    counterOfferRate: 0.36,
    sourcingChannels: { referral: 0.32, agency: 0.25, direct: 0.14, internal: 0.29 },
    salaryGrowthRate: 0.08,
    typicalExperience: { min: 9, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Chief Information Officer": {
    category: "Family Office - Operations & Finance",
    p25: 200000, p50: 300000, p75: 450000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "15-25% discretionary"
    },
    scarcity: 7.5,
    regionalNotes: "Total comp median $360k; cybersecurity expertise commands premium; SF/NYC +25%",
    trends: "Cybersecurity and data privacy increasingly critical; cloud migration driving demand",
    timeToFill: 19,
    candidatePoolSize: "37-111",
    turnover: { avgTenure: 7.8, annualTurnover: 0.09 },
    demandTrend: { direction: "growing", yoyChange: 0.09 },
    offerAcceptanceRate: 0.66,
    counterOfferRate: 0.36,
    sourcingChannels: { referral: 0.43, agency: 0.26, direct: 0.19, internal: 0.12 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 8, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Chief Compliance Officer": {
    category: "Family Office - Operations & Finance",
    p25: 200000, p50: 300000, p75: 450000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "15-25% discretionary"
    },
    scarcity: 7.5,
    regionalNotes: "Total comp median $360k; SEC/FINRA experience valued; RIA compliance expertise",
    trends: "Regulatory scrutiny of family offices increasing; demand growing rapidly",
    timeToFill: 14,
    candidatePoolSize: "101-237",
    turnover: { avgTenure: 5.5, annualTurnover: 0.13 },
    demandTrend: { direction: "growing", yoyChange: 0.07 },
    offerAcceptanceRate: 0.65,
    counterOfferRate: 0.31,
    sourcingChannels: { referral: 0.45, agency: 0.33, direct: 0.2, internal: 0.02 },
    salaryGrowthRate: 0.04,
    typicalExperience: { min: 12, typical: 15 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Senior Portfolio Manager": {
    category: "Family Office - Investment",
    p25: 250000, p50: 375000, p75: 550000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "30-50% plus carried interest on direct investments"
    },
    scarcity: 7.5,
    regionalNotes: "Median total comp $785k; $1B+ AUM: $350k-$800k base; co-investment rights common",
    trends: "Direct investment expertise highly valued; competition from PE/hedge funds",
    timeToFill: 13,
    candidatePoolSize: "119-173",
    turnover: { avgTenure: 5.4, annualTurnover: 0.15 },
    demandTrend: { direction: "growing", yoyChange: 0.15 },
    offerAcceptanceRate: 0.66,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.45, agency: 0.33, direct: 0.12, internal: 0.1 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 13, typical: 22 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Portfolio Manager": {
    category: "Family Office - Investment",
    p25: 200000, p50: 300000, p75: 425000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "25-40% discretionary plus potential carry"
    },
    scarcity: 6,
    regionalNotes: "Median total comp $400k; alternative investment experience premium",
    trends: "Growing allocation to alternatives increases demand for specialized PMs",
    timeToFill: 15,
    candidatePoolSize: "130-185",
    turnover: { avgTenure: 4.2, annualTurnover: 0.13 },
    demandTrend: { direction: "growing", yoyChange: 0.16 },
    offerAcceptanceRate: 0.73,
    counterOfferRate: 0.34,
    sourcingChannels: { referral: 0.47, agency: 0.32, direct: 0.09, internal: 0.12 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 12, typical: 18 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Senior Investment Analyst": {
    category: "Family Office - Investment",
    p25: 125000, p50: 180000, p75: 250000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Standard to premium coverage",
      bonus: "15-30% discretionary"
    },
    scarcity: 5,
    regionalNotes: "Median total comp $220k; PE/VC experience valued; $1B+: $150k-$320k base",
    trends: "Direct deal sourcing skills increasingly important",
    timeToFill: 12,
    candidatePoolSize: "118-247",
    turnover: { avgTenure: 5.5, annualTurnover: 0.09 },
    demandTrend: { direction: "growing", yoyChange: 0.22 },
    offerAcceptanceRate: 0.77,
    counterOfferRate: 0.17,
    sourcingChannels: { referral: 0.48, agency: 0.31, direct: 0.09, internal: 0.12 },
    salaryGrowthRate: 0.1,
    typicalExperience: { min: 6, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.11, topReasons: ['conflict of interest concerns', 'family politics', 'better firm offers'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.2, benefitsPercent: 0.15, signingBonusFrequency: 0.55, signingBonusRange: "50k-120k" },
    relocationWillingness: 0.45,
    backgroundCheckTimeline: 5
  },
  "Investment Analyst": {
    category: "Family Office - Investment",
    p25: 75000, p50: 95000, p75: 125000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "5-15% discretionary"
    },
    scarcity: 4,
    regionalNotes: "National average $86k; $1B+ AUM: $100k-$190k; total comp median $95k",
    trends: "Entry point to family office investment careers; strong candidate pipeline",
    timeToFill: 9,
    candidatePoolSize: "224-456",
    turnover: { avgTenure: 3.6, annualTurnover: 0.17 },
    demandTrend: { direction: "stable", yoyChange: 0.01 },
    offerAcceptanceRate: 0.91,
    counterOfferRate: 0.16,
    sourcingChannels: { referral: 0.42, agency: 0.34, direct: 0.1, internal: 0.14 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 5, typical: 10 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  },
  "Controller": {
    category: "Family Office - Operations & Finance",
    p25: 200000, p50: 260000, p75: 350000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Standard to premium coverage",
      bonus: "12-18% discretionary"
    },
    scarcity: 5.5,
    regionalNotes: "Median $240k; $1B+: $280k-$520k; total comp median $270k; fund accounting expertise valued",
    trends: "Multi-entity consolidation and alternative investment accounting driving complexity",
    timeToFill: 9,
    candidatePoolSize: "403-865",
    turnover: { avgTenure: 3.7, annualTurnover: 0.19 },
    demandTrend: { direction: "stable", yoyChange: 0.04 },
    offerAcceptanceRate: 0.85,
    counterOfferRate: 0.18,
    sourcingChannels: { referral: 0.41, agency: 0.26, direct: 0.21, internal: 0.12 },
    salaryGrowthRate: 0.05,
    typicalExperience: { min: 9, typical: 18 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  },
  "Operations Manager": {
    category: "Family Office - Operations & Finance",
    p25: 130000, p50: 180000, p75: 250000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Standard to premium coverage",
      bonus: "10-18% discretionary"
    },
    scarcity: 5,
    regionalNotes: "Miami market $143k median; total comp median $185k; process improvement skills valued",
    trends: "Technology implementation and vendor management increasingly important",
    timeToFill: 8,
    candidatePoolSize: "1162-1456",
    turnover: { avgTenure: 2.1, annualTurnover: 0.32 },
    demandTrend: { direction: "growing", yoyChange: 0.21 },
    offerAcceptanceRate: 0.76,
    counterOfferRate: 0.25,
    sourcingChannels: { referral: 0.47, agency: 0.25, direct: 0.19, internal: 0.09 },
    salaryGrowthRate: 0.06,
    typicalExperience: { min: 6, typical: 12 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  },
  "Risk & Compliance Manager": {
    category: "Family Office - Operations & Finance",
    p25: 70000, p50: 95000, p75: 116500,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Standard coverage",
      bonus: "10-15% discretionary"
    },
    scarcity: 5.5,
    regionalNotes: "National average $95k; total comp median $110k; regulatory experience premium",
    trends: "Growing role as family offices face increased regulatory scrutiny",
    timeToFill: 9,
    candidatePoolSize: "557-925",
    turnover: { avgTenure: 2.5, annualTurnover: 0.3 },
    demandTrend: { direction: "growing", yoyChange: 0.19 },
    offerAcceptanceRate: 0.82,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.42, agency: 0.3, direct: 0.2, internal: 0.08 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 5, typical: 9 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  },
  "HR Director": {
    category: "Family Office - Support",
    p25: 130000, p50: 170000, p75: 230000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Not typical",
      health: "Premium coverage",
      bonus: "12-20% discretionary"
    },
    scarcity: 6.5,
    regionalNotes: "NYC family office $200k; SF $190k; LA $169k; total comp median $190k",
    trends: "Talent retention and culture building critical as competition for FO talent intensifies",
    timeToFill: 9,
    candidatePoolSize: "482-775",
    turnover: { avgTenure: 3.7, annualTurnover: 0.19 },
    demandTrend: { direction: "growing", yoyChange: 0.2 },
    offerAcceptanceRate: 0.71,
    counterOfferRate: 0.32,
    sourcingChannels: { referral: 0.38, agency: 0.34, direct: 0.2, internal: 0.08 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 7, typical: 14 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  },
  "Executive Assistant to Principal": {
    category: "Family Office - Support",
    p25: 110000, p50: 160000, p75: 220000,
    benefits: {
      housing: "Not typically included",
      vehicle: "Mileage reimbursement",
      health: "Premium coverage",
      bonus: "5-12% discretionary"
    },
    scarcity: 4.5,
    regionalNotes: "Total comp median $155k; $1B+: $150k-$290k; family dynamics expertise valued",
    trends: "High-trust role with significant principal access; discretion paramount",
    timeToFill: 8,
    candidatePoolSize: "592-887",
    turnover: { avgTenure: 2.2, annualTurnover: 0.32 },
    demandTrend: { direction: "stable", yoyChange: 0.0 },
    offerAcceptanceRate: 0.79,
    counterOfferRate: 0.26,
    sourcingChannels: { referral: 0.38, agency: 0.25, direct: 0.16, internal: 0.21 },
    salaryGrowthRate: 0.07,
    typicalExperience: { min: 9, typical: 13 },
    retentionRisk: { firstYearAttrition: 0.22, topReasons: ['career progression limits', 'comp below market', 'scope too narrow'] },
    compensationStructure: { basePercent: 0.65, bonusPercent: 0.22, benefitsPercent: 0.13, signingBonusFrequency: 0.4, signingBonusRange: "20k-50k" },
    relocationWillingness: 0.42,
    backgroundCheckTimeline: 3
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all positions grouped by category
 */
export function getPositionsByCategory() {
  const grouped = {};
  for (const [position, data] of Object.entries(BENCHMARKS)) {
    const category = data.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({ name: position, ...data });
  }
  return grouped;
}

/**
 * Get position names as a flat array
 */
export function getAllPositionNames() {
  return Object.keys(BENCHMARKS);
}

/**
 * Apply regional multiplier to salary
 */
export function adjustSalaryForRegion(baseSalary, region) {
  const regionData = REGIONAL_MULTIPLIERS[region];
  if (!regionData) return baseSalary;
  return Math.round(baseSalary * regionData.multiplier);
}

/**
 * Get benchmark data for a position
 */
export function getBenchmark(positionName) {
  return BENCHMARKS[positionName] || null;
}

/**
 * Detect region from location string
 */
export function detectRegion(locationString) {
  if (!locationString) return null;
  const lower = locationString.toLowerCase();

  for (const [region, data] of Object.entries(REGIONAL_MULTIPLIERS)) {
    if (lower.includes(region.toLowerCase().replace(/_/g, ' '))) {
      return { region, ...data };
    }
  }

  // Check for common variations
  if (lower.includes('nyc') || lower.includes('new york')) return { region: 'New York City', ...REGIONAL_MULTIPLIERS['New York City'] };
  if (lower.includes('sf') || lower.includes('bay area')) return { region: 'San Francisco', ...REGIONAL_MULTIPLIERS['San Francisco'] };
  if (lower.includes('la') || lower.includes('los angeles')) return { region: 'Los Angeles', ...REGIONAL_MULTIPLIERS['Los Angeles'] };
  if (lower.includes('hamptons')) return { region: 'The Hamptons', ...REGIONAL_MULTIPLIERS['The Hamptons'] };
  if (lower.includes('palm beach') || lower.includes('west palm')) return { region: 'Palm Beach', ...REGIONAL_MULTIPLIERS['Palm Beach'] };

  return null;
}

