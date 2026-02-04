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
  version: "2.0"
};

// ============================================
// REGIONAL MULTIPLIERS
// ============================================
export const REGIONAL_MULTIPLIERS = {
  "National_US": { multiplier: 1.0, label: "National Average", tier: "standard" },
  "Midwest_US": { multiplier: 0.9, label: "Midwest", tier: "below-average" },
  "South_US": { multiplier: 0.95, label: "South (non-FL)", tier: "below-average" },
  "Los Angeles": { multiplier: 1.2, label: "LA Premium", tier: "high" },
  "San Francisco": { multiplier: 1.3, label: "SF Bay Premium", tier: "ultra-high" },
  "New York City": { multiplier: 1.4, label: "NYC Premium", tier: "ultra-high" },
  "Manhattan": { multiplier: 1.4, label: "Manhattan Premium", tier: "ultra-high" },
  "Palm Beach": { multiplier: 1.3, label: "Palm Beach Premium", tier: "high" },
  "Miami": { multiplier: 1.15, label: "Miami Premium", tier: "moderate" },
  "The Hamptons": { multiplier: 1.45, label: "Hamptons Premium", tier: "ultra-high" },
  "Greenwich": { multiplier: 1.3, label: "Greenwich Premium", tier: "high" },
  "Aspen": { multiplier: 1.6, label: "Aspen Peak Season", tier: "ultra-high" },
  "Vail": { multiplier: 1.5, label: "Vail Peak Season", tier: "ultra-high" },
  "Jackson Hole": { multiplier: 1.4, label: "Jackson Hole Premium", tier: "high" },
  "Nantucket": { multiplier: 1.35, label: "Island Premium", tier: "high" },
  "Martha's Vineyard": { multiplier: 1.35, label: "Island Premium", tier: "high" },
  "Seattle": { multiplier: 1.15, label: "Pacific NW Premium", tier: "moderate" },
  "Chicago": { multiplier: 1.05, label: "Slight Premium", tier: "moderate" },
  "Dallas": { multiplier: 1.0, label: "Market Rate", tier: "standard" },
  "Houston": { multiplier: 0.95, label: "Below Coastal", tier: "standard" },
  "London": { multiplier: 0.9, label: "London (GBP adjusted)", tier: "high" },
  "Monaco": { multiplier: 1.75, label: "Monaco Premium", tier: "ultra-high" },
  "Remote/Multiple": { multiplier: 1.1, label: "Flexibility Premium", tier: "variable" }
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
    trends: "Salaries up roughly 15-20% since 2022 with strong demand in family offices above $500M AUM"
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
    trends: "Compensation up ~20-25% since 2022 driven by competition with PE and multi-family offices"
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
    trends: "Role professionalized post-2020; more formal bonuses and carried interest structures"
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
    trends: "Single-property roles pay ~15-25% less than multi-estate positions"
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
    trends: "Salaries up ~20-30% since 2022 as portfolios become more global and complex"
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
    trends: "Role increasingly incorporates HR and vendor management"
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
    trends: "Growing integration with facilities tech and smart-home systems"
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
    trends: "More estates formalizing this as a distinct role above property/estate managers"
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
    trends: "Demand up roughly 25-30% since 2022; expectations for 24/7 availability"
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
    trends: "Roles often blend family support, admin, and light household management"
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
    trends: "Hybrid nanny/family-assistant roles increasingly common among younger UHNW families"
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
    trends: "Role is converging with concierge and travel advisory; strong growth in UHNW segment"
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
    trends: "Private aviation and villa/yacht integration now baseline for UHNW"
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
    trends: "Traditional role evolving to include digital/social media coordination"
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
    trends: "Role increasingly spans HR, vendor negotiation, and project management"
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
    trends: "Formal butlers in notably short supply; salaries up about 20-25% since 2022"
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
    trends: "Service expectations high but protocol less formal than traditional European butlers"
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
    trends: "Tech (inventory systems, scheduling) increasingly part of job"
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
    trends: "Role sometimes merges with Executive Housekeeper for smaller households"
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
    trends: "Revival of this traditional role in very large/heritage estates"
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
    trends: "Demand and comp up ~15-20% since 2022; specialized diets command premium"
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
    trends: "Travel flexibility is a major bottleneck; few chefs willing to travel constantly"
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
    trends: "Fine-dining backgrounds favored; competition from high-end restaurants"
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
    trends: "Growing with work-from-home and health-conscious UHNW clients"
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
    trends: "Increasing interest among collectors with multi-million-dollar cellars"
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
    trends: "Demand tied to event-heavy households and high-end entertaining"
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
    trends: "Growing emphasis on archival-quality care for wardrobes"
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
    trends: "Increasing popularity for flexibility and continuity; especially on remote estates"
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
    trends: "Demand up ~20% post-pandemic, especially for candidates with education or language skills"
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
    trends: "Higher stress roles; many families add rotating nannies for coverage"
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
    trends: "Strong demand for live-out in high-cost cities as housing becomes harder"
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
    trends: "Growing use among older parents and high-risk pregnancies"
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
    trends: "Post-pandemic interest in bespoke at-home schooling and hybrid programs"
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
    trends: "More common in families with heavy tutoring for school and test prep"
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
    trends: "Hybrid role between governess, tutor coordinator, and education consultant"
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
    trends: "Demand up 30-40% since 2020; oversight increasingly includes cyber and travel risk"
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
    trends: "Greater emphasis on de-escalation skills and social media monitoring"
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
    trends: "More integration with smart surveillance systems"
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
    trends: "Growing focus on advanced driving, medical training, and threat avoidance"
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
    trends: "More UHNW families using travel security in medium-risk destinations"
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
    trends: "One of the fastest-growing roles in family offices; pay rising 40-50% in recent years"
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
    trends: "App-based transport hasn't reduced demand among UHNW; trust and discretion crucial"
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
    trends: "Used for cross-country re-positioning of vehicles and family logistics"
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
    trends: "Growth tied to expansion of UHNW car collecting and motorsport hobbies"
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
    trends: "Emerging as dedicated role in households with private jets and frequent travel"
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
    trends: "Private aviation growth post-2020 has pushed comp higher"
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
    trends: "Sustainability and irrigation tech skills becoming more valuable"
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
    trends: "Organic and regenerative landscaping driving new skill requirements"
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
    trends: "Smart-home and building management tech increasingly required"
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
    trends: "Saltwater, ozone, and wellness-related installations increasing complexity"
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
    trends: "Role now often covers CAPEX planning and sustainability initiatives"
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
    trends: "Growth in owner-operated smaller yachts keeps demand healthy"
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
    trends: "Larger average yacht size drives higher compensation"
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
    trends: "Superyacht captain comp up ~25-30% since 2022; severe global shortage"
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
    trends: "Career progression path to captain roles; retention a key issue"
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
    trends: "Technical systems and hybrid propulsion increase value of experienced engineers"
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
    trends: "Hospitality and event skills critical; strong pipeline from luxury hotel industry"
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
    trends: "Role increasingly tech-driven (inventory, accounting systems)"
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
    trends: "Entry point for many crew; rapid wage gains in busy charter seasons"
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
    trends: "Aging client base and home-based post-acute care support demand"
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
    trends: "Geriatric care management and coordination with concierge physicians on the rise"
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
    trends: "Strong growth in wellness and high-end fitness programs"
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
    trends: "Holistic wellness programs (nutrition, mental health, retreats) increasingly expected"
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
    trends: "Growing niche as UHNW families seek one-stop coordination of medical services"
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
    trends: "Guest services roles increasingly incorporate concierge and event functions"
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
    trends: "High-end private events increasingly complex, with large budgets and global vendors"
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
    trends: "Sustainability and special-diet awareness increasingly important"
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
    trends: "More UHNW collectors treat cellars as alternative assets requiring professional management"
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
    trends: "Growing role as UHNW families manage multiple au pairs across properties"
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
    trends: "High demand among new parents; often overlaps with newborn care specialist roles"
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
    trends: "Increasing demand as family offices professionalize investment operations"
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
    trends: "Growing with expansion of UHNW vacation property portfolios"
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
    trends: "Essential for properties with limited family use; often combined with security duties"
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
    trends: "Role expanding beyond traditional concierge to lifestyle management"
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
    trends: "Increasing tech sophistication required; often part of larger EA role"
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
    trends: "Increasing demand for specialized skills (fine fabrics, art-safe cleaning)"
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
    trends: "Growing role in estates with extensive gardens and frequent entertaining"
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
    trends: "Revival of traditional valet service among UHNW principals"
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
    trends: "Strong demand for health-conscious and family-friendly meal preparation"
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
    trends: "Sustainability and native plantings increasing in importance"
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
    trends: "Role often includes tender and small craft maintenance"
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
    trends: "Technical certifications increasingly required; hybrid systems knowledge valued"
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
    trends: "Role gaining prominence on larger vessels with complex interior operations"
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
    trends: "Entry point to yachting career; strong demand in charter seasons"
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
    trends: "Role encompasses IT, AV, smart home, and security systems integration"
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
    trends: "Increasingly critical role as homes become more connected and security-conscious"
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
    trends: "Private aviation boom since 2020 has increased competition for experienced pilots"
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
    trends: "Growing demand as UHNW families invest in home wellness facilities"
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
    trends: "Increasing demand for elderly companionship with aging UHNW population"
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
    trends: "Role professionalizing with more UHNW families seeking dedicated pet staff"
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
    trends: "Growing as UHNW families professionalize management of diverse collections"
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
    trends: "More collectors seeking in-house expertise for portfolio management and acquisitions"
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
    trends: "Growing with expansion of private exhibition spaces in UHNW homes"
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
    trends: "Role often includes oversight of trainers, grooms, and facility maintenance"
  },

  // ==========================================
  // FAMILY OFFICE - C-SUITE
  // Salaries based on $300M-$1B AUM (typical UHNW)
  // ==========================================
  "CEO (Family Office)": {
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
    trends: "Compensation up 4-10% in 2024-2025; competition from multi-family offices intensifying"
  },
  "COO (Family Office)": {
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
    trends: "Role gaining prominence as family offices professionalize operations"
  },
  "CIO (Family Office)": {
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
    trends: "Highest-paid role in most family offices; co-investment rights increasingly common"
  },
  "CFO (Family Office)": {
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
    trends: "Increasingly responsible for tax strategy and multi-entity consolidation"
  },
  "General Counsel (Family Office)": {
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
    trends: "Growing demand for in-house counsel as regulatory complexity increases"
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
    trends: "Critical role with changing tax landscape; demand exceeds supply"
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
    trends: "Growing emphasis on impact measurement and next-gen engagement"
  },
  "Chief Information Officer (Family Office)": {
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
    trends: "Cybersecurity and data privacy increasingly critical; cloud migration driving demand"
  },
  "Chief Compliance Officer (Family Office)": {
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
    trends: "Regulatory scrutiny of family offices increasing; demand growing rapidly"
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
    trends: "Direct investment expertise highly valued; competition from PE/hedge funds"
  },
  "Portfolio Manager (Family Office)": {
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
    trends: "Growing allocation to alternatives increases demand for specialized PMs"
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
    trends: "Direct deal sourcing skills increasingly important"
  },
  "Investment Analyst (Family Office)": {
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
    trends: "Entry point to family office investment careers; strong candidate pipeline"
  },
  "Controller (Family Office)": {
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
    trends: "Multi-entity consolidation and alternative investment accounting driving complexity"
  },
  "Operations Manager (Family Office)": {
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
    trends: "Technology implementation and vendor management increasingly important"
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
    trends: "Growing role as family offices face increased regulatory scrutiny"
  },
  "HR Director (Family Office)": {
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
    trends: "Talent retention and culture building critical as competition for FO talent intensifies"
  },
  "Executive Assistant to CEO (Family Office)": {
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
    trends: "High-trust role with significant principal access; discretion paramount"
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
