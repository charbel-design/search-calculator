import React from 'react';
import {
  MapPin, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Zap, ChevronDown, Search, Briefcase, Shield, Anchor, Plane
} from 'lucide-react';
import { BENCHMARKS, CATEGORY_GROUPS } from '../salaryData';
import { CustomSelect } from './CustomSelect';

const LOADING_FACTS = [
  "The average UHNW household employs 7-12 full-time staff across multiple properties.",
  "A Chief of Staff in a family office typically manages $2M-$5M in annual household operating budgets.",
  "Over 60% of private service placements come through referrals rather than job boards.",
  "The average tenure for a private chef in an UHNW household is just 2.3 years.",
  "Estate Managers in top-tier markets earn 30-40% more than the national median.",
  "Bilingual candidates command a 15-25% salary premium in private service roles.",
  "The counter-offer rate for senior household staff exceeds 40% in major metros.",
  "Family offices managing $500M+ typically employ 15-25 dedicated staff members.",
  "NDA requirements add 1-3 weeks to the average placement timeline.",
  "Relocation packages for estate managers can reach $50,000-$100,000.",
  "Maritime crew placement timelines shrink by 40% during peak charter season.",
  "The global superyacht fleet has grown 77% over the past decade.",
  "Private aviation staff turnover is 35% lower when housing is included in compensation.",
  "Over 80% of UHNW principals prefer candidates vetted through personal networks.",
  "The top 3 departure reasons in private service: burnout, lack of boundaries, and relocation.",
  "A typical executive search produces 200+ initial candidates narrowed to 3-5 finalists.",
  "Background checks for high-profile households average 2-4 weeks for domestic and international vetting.",
  "Household managers who speak 3+ languages are in the top 5% of candidate scarcity.",
  "The demand for tech-savvy estate managers has increased 300% since 2019.",
  "Only 12% of private service professionals have formal hospitality certifications.",
  "Yacht crew with both STCW and ENG1 certifications earn 20% above median.",
  "The average search for a C-suite family office role takes 90-120 days.",
  "Signing bonuses are offered in roughly 35% of senior private service placements.",
  "First-year attrition in private service drops by half when cultural fit is assessed during hiring.",
  "Florida, California, and New York account for 65% of all UHNW household staffing demand.",
  "Seasonal staffing needs spike 40% between November and February in resort markets.",
  "The personal assistant role has evolved — 70% now require project management skills.",
  "Private service professionals with military backgrounds have 45% higher retention rates.",
  "Dual-couple households (two principals with separate offices) require 2x the typical staff.",
  "A single property estate typically needs 3-5 core staff; multi-property estates need 8-15.",
  "Travel-heavy roles (50%+ travel) reduce the candidate pool by approximately 60%.",
  "The median time-to-hire for a house manager in Manhattan is 8-12 weeks.",
  "Candidates who complete a trial period have 70% higher long-term retention.",
  "Executive protection professionals command premiums of 40-60% over standard security roles.",
  "Over 50% of private chef candidates are sourced from high-end restaurant networks.",
  "The family office sector is projected to manage $5.4 trillion in assets by 2030.",
  "Remote estate oversight roles have grown 150% since the pandemic.",
  "The average UHNW family interviews 6-8 candidates before making a hire.",
  "Discretion-heavy roles (celebrity, political) add 2-3 weeks to sourcing timelines.",
  "Benefits packages in UHNW households often include housing, vehicles, and travel allowances.",
  "Nanny placements in UHNW households require an average of 4 reference checks.",
  "The busiest hiring months for private service are January, June, and September.",
  "Candidates with smart-home technology skills are 3x more likely to receive multiple offers.",
  "Estate managers overseeing $10M+ properties typically earn $150K-$250K base salary.",
  "Cultural alignment interviews reduce first-year turnover by up to 55%.",
  "The yacht industry requires crew certifications to be renewed every 5 years.",
  "Multi-generational households are the fastest-growing segment in private service staffing.",
  "Over 40% of family office hires come with non-compete agreements lasting 12-24 months.",
  "The average cost-per-hire for a senior household position is $15,000-$25,000.",
  "Principals who provide clear role documentation see 3x faster placement timelines.",
];

export function FormSteps({
  step, setStep, formData, setFormData, loading, loadingStep, error, setError,
  warnings, positionSearch, setPositionSearch, showPositionSuggestions, setShowPositionSuggestions,
  highlightedPositionIndex, setHighlightedPositionIndex, filteredPositions,
  showLocationSuggestions, setShowLocationSuggestions, highlightedLocationIndex, setHighlightedLocationIndex,
  filteredLocationSuggestions, handleInputChange, handleLocationKeyDown, handleMultiSelect,
  validateAndWarn, validateStep, nextStep, calculateComplexity,
  isCorporateRole, isMaritimeRole, isAviationRole, isPortfolioRole, budgetRanges, timelineOptions, discretionLevels,
  householdLanguageOptions, corporateLanguageOptions, householdCertificationOptions,
  corporateCertificationOptions, portfolioCertificationOptions, portfolioLanguageOptions,
  dealStageOptions, governanceOptions, coInvestorOptions,
  travelOptions, corporateLanguageShortList,
  showLanguages, setShowLanguages, commonRoles
}) {
  const [showAllCerts, setShowAllCerts] = React.useState(false);
  const [showAllLangs, setShowAllLangs] = React.useState(false);
  const [positionFilter, setPositionFilter] = React.useState(null);

  // Category mapping for position filter
  const catToGroup = React.useMemo(() => {
    const map = {};
    for (const [gName, subCats] of Object.entries(CATEGORY_GROUPS)) {
      for (const cat of subCats) map[cat] = gName;
    }
    return map;
  }, []);

  // Apply category filter on top of search filter
  const displayedPositions = React.useMemo(() => {
    if (!positionFilter) return filteredPositions;
    return filteredPositions.filter(role => catToGroup[BENCHMARKS[role]?.category] === positionFilter);
  }, [filteredPositions, positionFilter, catToGroup]);

  // Role counts per group (based on current search filter)
  const groupCounts = React.useMemo(() => {
    const counts = {};
    for (const role of filteredPositions) {
      const g = catToGroup[BENCHMARKS[role]?.category];
      if (g) counts[g] = (counts[g] || 0) + 1;
    }
    return counts;
  }, [filteredPositions, catToGroup]);

  // Clear category filter when user starts typing
  React.useEffect(() => {
    if (positionSearch.trim()) setPositionFilter(null);
  }, [positionSearch]);

  const [elapsed, setElapsed] = React.useState(0);
  const [factIndex, setFactIndex] = React.useState(0);
  const [factFade, setFactFade] = React.useState(true);

  React.useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // Pick a random starting fact when loading begins, then rotate every 5s
  React.useEffect(() => {
    if (!loading) return;
    setFactIndex(Math.floor(Math.random() * LOADING_FACTS.length));
    setFactFade(true);
    const interval = setInterval(() => {
      setFactFade(false);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % LOADING_FACTS.length);
        setFactFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  const stepLabels = ['Role', 'Budget', 'Requirements', 'Finalize'];

  // Role-aware placeholder text
  const rolePlaceholders = React.useMemo(() => {
    const pos = formData.positionType;
    const bm = pos ? BENCHMARKS[pos] : null;
    const cat = bm?.category || '';

    // --- Ideal candidate description ---
    const roleSpecific = {
      "Portfolio Company CEO / Managing Director": "e.g., PE-backed CEO with $50M+ revenue experience, turnaround or growth track record, strong board presence, equity negotiation savvy...",
      "Portfolio Company CFO": "e.g., Big 4 + PE-backed CFO, EBITDA-driven reporting, debt covenant management, IPO or exit-ready audit preparation...",
      "Portfolio Company COO": "e.g., Operational transformation in PE-backed companies, supply chain or manufacturing optimization, P&L ownership, Six Sigma...",
      "Portfolio Company General Counsel": "e.g., M&A transactional experience, PE fund-side or portfolio company legal, regulatory compliance, board governance...",
      "Portfolio Company CHRO / Head of People": "e.g., Organizational design in PE-backed contexts, talent integration post-acquisition, change management, culture building...",
      "Board Director (Independent)": "e.g., Independent board experience with PE or FO-backed companies, NACD certified, audit or compensation committee, industry expertise...",
      "Board Chair (Independent)": "e.g., Board chair with PE/FO governance experience, CEO oversight, strategic planning leadership, succession planning...",
      "Operating Partner": "e.g., Fund-level operating partner, portfolio value creation across 5+ companies, hands-on transformation, carry-motivated...",
      "Investment Director (Portfolio Oversight)": "e.g., Direct investing experience, deal sourcing and due diligence, portfolio monitoring, co-investment structuring...",
      "Head of Portfolio Operations": "e.g., Multi-company operational oversight, PMO leadership, digital systems implementation, cross-portfolio KPI frameworks...",
      "VP Finance / FP&A (Portfolio)": "e.g., FP&A in PE-backed company, financial modeling, board reporting packages, ERP implementation, CPA preferred...",
      "VP Operations (Portfolio)": "e.g., Plant or multi-site operations leadership, lean manufacturing, supply chain optimization, KPI-driven improvement...",
      "VP Sales / CRO (Portfolio)": "e.g., PE-backed sales leadership, $20M+ ARR scaling, sales team builder, data-driven pipeline, quota-carrying background...",
      "VP Technology / CTO (Portfolio)": "e.g., Cloud-native architecture, engineering team builder, tech debt reduction, AI/ML integration, PE-backed environment...",
      "VP Marketing / CMO (Portfolio)": "e.g., Demand generation in PE-backed growth companies, brand-to-revenue pipeline, MarTech stack expertise, CAC optimization...",
      "Chief of Staff": "e.g., 10+ years managing UHNW estates, multi-property oversight, vendor management, principal-facing presence, travel-ready...",
      "Estate Manager": "e.g., 8+ years managing $10M+ estates, smart-home technology, staff supervision, project management, multi-property...",
      "Family Office Director": "e.g., 15+ years family office leadership, $500M+ AUM, next-gen wealth transfer, multi-jurisdictional tax coordination...",
      "Private Chef": "e.g., Culinary degree + fine dining experience, Mediterranean and French cuisine, dietary restrictions, private events and entertaining...",
      "Executive Chef": "e.g., Michelin-star or 5-star hotel kitchen, team leadership, menu planning for principals and large-scale events, farm-to-table...",
      "Captain (Yacht)": "e.g., MCA Master 3000GT, 10+ years on 60m+, Mediterranean and Caribbean charter, fleet management, crew leadership...",
      "Head of Security / Security Director": "e.g., Former Secret Service or law enforcement, advance team experience, threat assessment, UHNW family protocols, global travel...",
      "Nanny": "e.g., Early childhood education degree, 5+ years with UHNW families, bilingual preferred, newborn or multiples experience, travel-ready...",
      "House Manager": "e.g., 5+ years managing UHNW households, staff scheduling, vendor coordination, event planning, multi-property...",
      "Butler": "e.g., Formal service training (British Butler Institute or equivalent), silver service, wine knowledge, table setting, discretion...",
      "Personal Assistant": "e.g., 5+ years supporting UHNW principals, complex travel logistics, calendar management, project coordination, NDA-comfortable...",
    };
    if (roleSpecific[pos]) return {
      candidate: roleSpecific[pos],
      location: getLocationHint(cat),
    };

    // Category-based fallbacks
    const categoryHints = {
      "Family Office - C-Suite": "e.g., 15+ years in family office or institutional investment, principal-level trust, direct deal experience, discretion...",
      "Family Office - Investment": "e.g., CFA preferred, 10+ years in multi-asset allocation, family office or endowment background, co-investment experience...",
      "Family Office - Operations & Finance": "e.g., CPA preferred, 5+ years in family office accounting, multi-entity reporting, tax coordination, bill-pay systems...",
      "Family Office - Support": "e.g., 5+ years supporting UHNW principals or family office teams, tech-savvy, highly organized, NDA-comfortable...",
      "Portfolio Company - C-Suite": "e.g., PE-backed C-suite experience, value creation track record, board reporting fluency, equity negotiation, operational focus...",
      "Portfolio Company - Board": "e.g., Independent board experience, governance expertise, committee leadership, PE or family office familiarity...",
      "Portfolio Company - Operations": "e.g., Fund-level or portfolio company operations, hands-on value creation, carry-motivated, cross-portfolio experience...",
      "Portfolio Company - Functional Leadership": "e.g., VP-level in PE-backed or high-growth companies, hands-on builder, KPI-driven, comfortable with board reporting...",
      "Estate Leadership": "e.g., 10+ years managing UHNW estates, multi-property oversight, vendor management, staff supervision, travel-ready...",
      "Personal & Administrative": "e.g., 5+ years as personal or executive assistant to UHNW principals, travel logistics, calendar management, discrete...",
      "Formal Service": "e.g., Formal service training, silver service, wine and table knowledge, multi-property experience, discrete and polished...",
      "Culinary": "e.g., Fine dining or Michelin background, specialized cuisine expertise, dietary restriction knowledge, private events...",
      "Childcare & Education": "e.g., Education degree, 5+ years with UHNW families, bilingual preferred, curriculum development, travel-willing...",
      "Security": "e.g., Law enforcement or military background, close protection certified, threat assessment, UHNW family protocols...",
      "Transportation": "e.g., Professional chauffeur license, 5+ years driving for UHNW principals, impeccable record, discrete, vehicle maintenance...",
      "Maritime / Yacht": "e.g., STCW and ENG1 certified, 5+ years on 50m+ yachts, Med and Caribbean experience, charter-ready...",
      "Grounds & Outdoor": "e.g., Horticulture degree or 10+ years grounds management, irrigation systems, seasonal planning, multiple properties...",
      "Healthcare & Wellness": "e.g., Licensed RN or wellness practitioner, 5+ years in private or concierge healthcare, travel-willing, discrete...",
      "Hospitality & Collections": "e.g., Luxury hospitality background, art handling or wine cellar management, event coordination, inventory systems...",
    };

    return {
      candidate: categoryHints[cat] || "Describe your ideal candidate — experience, skills, certifications, languages, personality traits...",
      location: getLocationHint(cat),
    };
  }, [formData.positionType]);

  function getLocationHint(category) {
    if (category === 'Maritime / Yacht') return "e.g., Fort Lauderdale, FL or Antibes, France";
    if (category?.startsWith('Portfolio Company')) return "e.g., New York, NY or London, UK";
    if (category?.startsWith('Family Office')) return "e.g., New York, NY or Zurich, Switzerland";
    if (category === 'Transportation') return "e.g., Greenwich, CT or Beverly Hills, CA";
    return "e.g., Palm Beach, FL or Monaco";
  }

  return (
    <>
      {/* Progress Indicator — Minimal */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Step {step} of 4</span>
          <span className="text-xs" style={{ color: '#a1a1a6' }}>{stepLabels[step - 1]}</span>
        </div>
        <div className="rounded-card overflow-hidden" style={{ backgroundColor: '#d2d4ff', height: '2px' }}>
          <div
            className="h-full rounded-card transition-all duration-500 ease-out"
            style={{ width: `${((step) / 4) * 100}%`, backgroundColor: '#2814ff' }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-card shadow-card p-6 sm:p-8 form-card" aria-label="Search parameters form">

        {/* Loading Overlay — Minimal */}
        {loading && (
          <div className="fixed inset-0 loading-overlay flex flex-col items-center justify-center z-50">
            {/* Thin progress bar at top */}
            <div className="absolute top-0 left-0 right-0" style={{ backgroundColor: '#d2d4ff', height: '2px' }}>
              <div className="h-full transition-all duration-1000 ease-out" style={{ backgroundColor: '#2814ff', width: `${Math.min(95, loadingStep * 25)}%` }} />
            </div>
            <div className="text-center max-w-md px-6">
              <p className="text-sm font-medium" style={{ color: '#1d1d1f' }}>Analyzing your search...</p>
              <p className="text-xs mt-1 tabular-nums" style={{ color: '#a1a1a6' }}>{elapsed}s</p>
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid #d2d4ff' }}>
                <p className="text-[10px] uppercase tracking-widest font-medium mb-2" style={{ color: '#2814ff', letterSpacing: '0.1em' }}>Did you know?</p>
                <p className="text-sm leading-relaxed transition-opacity duration-300" style={{ color: '#6e6e73', opacity: factFade ? 1 : 0 }}>
                  {LOADING_FACTS[factIndex]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Role & Location */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: '#1d1d1f' }}>Tell us about the role</h3>
              <p className="text-sm" style={{ color: '#6e6e73' }}>Start with the basics — what you're looking for and where.</p>
            </div>

            {/* Position Type */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                Position Type <span style={{ color: '#2814ff' }}>*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#a1a1a6' }} />
                <input type="text"
                  value={formData.positionType ? formData.positionType : positionSearch}
                  onChange={(e) => { setPositionSearch(e.target.value); setFormData({ ...formData, positionType: '' }); setShowPositionSuggestions(true); setHighlightedPositionIndex(-1); }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2814ff'; setShowPositionSuggestions(true); if (formData.positionType) { setPositionSearch(''); setFormData({ ...formData, positionType: '' }); } }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d2d2d7'; setTimeout(() => { setShowPositionSuggestions(false); setHighlightedLocationIndex(-1); }, 200); }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedPositionIndex(prev => prev < displayedPositions.length - 1 ? prev + 1 : prev); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedPositionIndex(prev => prev > 0 ? prev - 1 : prev); }
                    else if (e.key === 'Enter' && highlightedPositionIndex >= 0) { e.preventDefault(); const selected = displayedPositions[highlightedPositionIndex]; if (selected) { setFormData({ ...formData, positionType: selected }); setPositionSearch(''); setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); setPositionFilter(null); } }
                    else if (e.key === 'Escape') { setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); setPositionFilter(null); }
                  }}
                  className="w-full pl-10 pr-10 py-3 border rounded-btn transition-colors duration-200 text-sm"
                  style={{ borderColor: '#d2d2d7', minHeight: '44px', outline: 'none' }}
                  placeholder="Search roles... (e.g., Estate Manager, CIO, Private Chef)"
                />
                {formData.positionType && (
                  <button type="button" onClick={() => { setFormData({ ...formData, positionType: '' }); setPositionSearch(''); setPositionFilter(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-75 transition-opacity" style={{ color: '#a1a1a6' }}>
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                )}
                {showPositionSuggestions && filteredPositions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-btn shadow-elevated overflow-hidden">
                    {/* Category filter pills */}
                    <div className="flex gap-1.5 px-3 py-2.5" style={{ borderBottom: '1px solid #eeeeff', backgroundColor: '#fafaff' }}>
                      {[
                        { key: "Family Office - Corporate", label: "Family Office", Icon: Briefcase },
                        { key: "Portfolio Company", label: "Portfolio Co.", Icon: Target },
                        { key: "Private Service", label: "Private Service", Icon: Shield },
                      ].map(({ key, label, Icon }) => (
                        groupCounts[key] > 0 && (
                          <button key={key} type="button"
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setPositionFilter(positionFilter === key ? null : key); setHighlightedPositionIndex(-1); }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200"
                            style={positionFilter === key
                              ? { backgroundColor: '#2814ff', color: '#ffffff', boxShadow: '0 1px 3px rgba(40,20,255,0.3)' }
                              : { backgroundColor: '#ffffff', color: '#6e6e73', border: '1px solid #e5e5ea' }
                            }>
                            <Icon className="w-3 h-3" />
                            <span>{label}</span>
                            <span className="tabular-nums" style={{ opacity: 0.6 }}>{groupCounts[key]}</span>
                          </button>
                        )
                      ))}
                    </div>
                    {/* Role list */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar">
                      {(() => {
                        const groupLabels = { "Family Office - Corporate": "Family Office", "Portfolio Company": "Portfolio Company", "Private Service": "Private Service & Household" };
                        let lastGroup = null;
                        return displayedPositions.map((role, idx) => {
                          const group = catToGroup[BENCHMARKS[role]?.category] || null;
                          const showHeader = !positionFilter && group && group !== lastGroup;
                          if (showHeader) lastGroup = group;
                          return (
                            <React.Fragment key={role}>
                              {showHeader && (
                                <div className="px-4 py-1.5 bg-white" style={{ borderBottom: '1px solid #eeeeff' }}>
                                  <span className="text-[10px] font-semibold uppercase" style={{ color: '#2814ff', letterSpacing: '0.08em' }}>{groupLabels[group] || group}</span>
                                </div>
                              )}
                              <button type="button"
                                onClick={() => { setFormData({ ...formData, positionType: role }); setPositionSearch(''); setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); setPositionFilter(null); }}
                                onMouseEnter={() => setHighlightedPositionIndex(idx)}
                                className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors duration-100"
                                style={idx === highlightedPositionIndex ? { backgroundColor: '#2814ff', color: '#ffffff' } : { color: '#1d1d1f' }}>
                                <span>{role}</span>
                                {BENCHMARKS[role] && <span className="text-xs ml-2 tabular-nums" style={{ opacity: idx === highlightedPositionIndex ? 0.8 : 0.5 }}>${BENCHMARKS[role].p50.toLocaleString()}</span>}
                              </button>
                            </React.Fragment>
                          );
                        });
                      })()}
                      {displayedPositions.length === 0 && positionFilter && (
                        <div className="p-4 text-center">
                          <p className="text-sm" style={{ color: '#6e6e73' }}>No roles match in this category</p>
                          <button type="button" onMouseDown={(e) => { e.preventDefault(); setPositionFilter(null); }}
                            className="mt-1 text-xs font-medium hover:opacity-75" style={{ color: '#2814ff' }}>Show all roles</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {showPositionSuggestions && positionSearch && filteredPositions.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-btn shadow-elevated p-4 text-center text-sm" style={{ color: '#6e6e73' }}>
                    No roles match "{positionSearch}"
                  </div>
                )}
              </div>
              {formData.positionType && BENCHMARKS[formData.positionType] && (
                <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: '#6e6e73' }}>
                  <span>Market: <strong style={{ color: '#1d1d1f' }}>${BENCHMARKS[formData.positionType].p25.toLocaleString()} &ndash; ${BENCHMARKS[formData.positionType].p75.toLocaleString()}</strong></span>
                  {BENCHMARKS[formData.positionType].scarcity && (
                    <span className="inline-flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${BENCHMARKS[formData.positionType].scarcity >= 7 ? 'bg-b-pink-400' : BENCHMARKS[formData.positionType].scarcity >= 5 ? 'bg-b-ocre-400' : 'bg-b-opal-400'}`} />
                      {BENCHMARKS[formData.positionType].scarcity >= 7 ? 'Hard to find' : BENCHMARKS[formData.positionType].scarcity >= 5 ? 'Moderate' : 'Widely available'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                Primary Location <span style={{ color: '#2814ff' }}>*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a1a1a6' }} />
                <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#2814ff'; setShowLocationSuggestions(true); }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d2d2d7'; setTimeout(() => { setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }, 200); }}
                  onKeyDown={handleLocationKeyDown}
                  className="w-full pl-10 pr-4 py-3 border rounded-btn transition-colors duration-200 text-sm"
                  style={{ borderColor: '#d2d2d7', minHeight: '44px', outline: 'none' }}
                  placeholder={rolePlaceholders.location} />
              </div>
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-btn shadow-elevated max-h-64 overflow-y-auto custom-scrollbar">
                  {filteredLocationSuggestions.map((loc, idx) => (
                    <button key={idx} type="button"
                      ref={idx === highlightedLocationIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
                      onClick={() => { setFormData({ ...formData, location: loc }); setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }}
                      onMouseEnter={() => setHighlightedLocationIndex(idx)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-100"
                      style={idx === highlightedLocationIndex ? { backgroundColor: '#2814ff', color: '#ffffff' } : { color: '#1d1d1f' }}>
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discretion Level */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Discretion Level</label>
              <CustomSelect name="discretionLevel" value={formData.discretionLevel} onChange={handleInputChange}
                options={discretionLevels.map(d => ({ value: d.value, label: `${d.label} — ${d.description}` }))} placeholder="Select discretion level" />
            </div>
          </div>
        )}

        {/* Step 2: Budget & Timeline */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: '#1d1d1f' }}>Budget & Timeline</h3>
              <p className="text-sm" style={{ color: '#6e6e73' }}>Set your expectations for compensation and timing.</p>
            </div>

            {/* Timeline Cards */}
            <div>
              <label className="block text-xs font-medium uppercase mb-3" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                Timeline <span style={{ color: '#2814ff' }}>*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timelineOptions.map(opt => {
                  const isSelected = formData.timeline === opt.value;
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setFormData({ ...formData, timeline: opt.value })}
                      className="p-4 rounded-btn text-left transition-all duration-200 bg-white"
                      style={{ border: isSelected ? '2px solid #2814ff' : '1px solid #d2d2d7' }}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm" style={{ color: isSelected ? '#2814ff' : '#1d1d1f' }}>{opt.label}</span>
                        <Clock className="w-4 h-4" style={{ color: isSelected ? '#2814ff' : '#a1a1a6' }} />
                      </div>
                      <p className="text-xs" style={{ color: isSelected ? '#2814ff' : '#6e6e73' }}>{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                Budget Range <span style={{ color: '#2814ff' }}>*</span>
              </label>
              <CustomSelect name="budgetRange" value={formData.budgetRange} onChange={handleInputChange}
                options={budgetRanges} placeholder="Select budget range" />
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="p-3.5 rounded-btn flex items-start gap-3 text-sm"
                    style={{
                      backgroundColor: w.type === 'critical' ? '#fdf2f4' : w.type === 'warning' ? '#fef8f0' : '#eeeeff',
                      borderLeft: `2px solid ${w.type === 'critical' ? '#c77d8a' : w.type === 'warning' ? '#ddb87e' : '#2814ff'}`
                    }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: w.type === 'critical' ? '#9e5f6a' : w.type === 'warning' ? '#a47840' : '#2814ff' }} />
                    <div>
                      <p className="font-medium" style={{ color: w.type === 'critical' ? '#9e5f6a' : w.type === 'warning' ? '#a47840' : '#2814ff' }}>{w.message}</p>
                      {w.suggestion && <p className="text-xs mt-1" style={{ color: '#6e6e73' }}>{w.suggestion}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: '#1d1d1f' }}>Key Requirements</h3>
              <p className="text-sm" style={{ color: '#6e6e73' }}>Add specifics that matter most — the more detail, the better your analysis.</p>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                Describe the ideal candidate <span style={{ color: '#2814ff' }}>*</span>
              </label>
              <textarea name="keyRequirements" value={formData.keyRequirements} onChange={handleInputChange} rows={3}
                className="w-full px-4 py-3 border rounded-btn transition-colors duration-200 text-sm resize-none"
                style={{ borderColor: '#d2d2d7', minHeight: '44px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2814ff'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d2d2d7'}
                placeholder={rolePlaceholders.candidate} />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs" style={{ color: formData.keyRequirements.length >= 25 ? '#5f9488' : '#a1a1a6' }}>
                  {formData.keyRequirements.length >= 25 ? 'Looking good' : `${25 - formData.keyRequirements.length} more characters for best results`}
                </p>
                <div className="h-1 w-16 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5ea' }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${Math.min(100, (formData.keyRequirements.length / 25) * 100)}%`,
                    backgroundColor: formData.keyRequirements.length >= 25 ? '#5f9488' : '#a1a1a6'
                  }} />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                {isPortfolioRole ? 'Qualifications & Experience' : isCorporateRole ? 'Professional Certifications' : 'Certifications'}
                <span className="normal-case ml-1.5" style={{ color: '#a1a1a6', letterSpacing: 'normal' }}>(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(isPortfolioRole ? portfolioCertificationOptions : isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).slice(0, showAllCerts ? undefined : 6).map(cert => (
                  <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                    className="px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200"
                    style={formData.certifications.includes(cert)
                      ? { backgroundColor: '#2814ff', color: '#ffffff' }
                      : { backgroundColor: '#eeeeff', color: '#6e6e73' }
                    }>
                    {cert}
                  </button>
                ))}
              </div>
              {(isPortfolioRole ? portfolioCertificationOptions : isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length > 6 && (
                <button type="button" onClick={() => setShowAllCerts(!showAllCerts)}
                  className="mt-2 text-xs hover:opacity-75 transition-opacity" style={{ color: '#a1a1a6' }}>
                  {showAllCerts ? 'Show less' : `+ ${(isPortfolioRole ? portfolioCertificationOptions : isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length - 6} more`}
                </button>
              )}
            </div>

            {/* Languages */}
            {(isCorporateRole || isPortfolioRole) ? (
              <div className="rounded-btn overflow-hidden" style={{ border: '1px solid #d2d2d7' }}>
                <button type="button" onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center justify-between w-full text-left p-3.5 transition-opacity hover:opacity-88">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Language Requirements</span>
                    <span className="text-xs normal-case" style={{ color: '#a1a1a6', letterSpacing: 'normal' }}>(optional)</span>
                    {formData.languageRequirements.length > 0 && !showLanguages && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#eeeeff', color: '#2814ff' }}>{formData.languageRequirements.length} selected</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLanguages ? 'rotate-180' : ''}`} style={{ color: '#a1a1a6' }} />
                </button>
                {showLanguages && (
                  <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid #e5e5ea' }}>
                    <div className="flex flex-wrap gap-2 pt-3">
                      {(isPortfolioRole ? portfolioLanguageOptions : corporateLanguageShortList).slice(0, showAllLangs ? undefined : 8).map(lang => (
                        <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                          className="px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200"
                          style={formData.languageRequirements.includes(lang)
                            ? { backgroundColor: '#2814ff', color: '#ffffff' }
                            : { backgroundColor: '#eeeeff', color: '#6e6e73' }
                          }>
                          {lang}
                        </button>
                      ))}
                    </div>
                    {(isPortfolioRole ? portfolioLanguageOptions : corporateLanguageShortList).length > 8 && (
                      <button type="button" onClick={() => setShowAllLangs(!showAllLangs)}
                        className="mt-2 text-xs hover:opacity-75 transition-opacity" style={{ color: '#a1a1a6' }}>
                        {showAllLangs ? 'Show less' : `+ ${(isPortfolioRole ? portfolioLanguageOptions : corporateLanguageShortList).length - 8} more`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                  Language Requirements
                  <span className="normal-case ml-1.5" style={{ color: '#a1a1a6', letterSpacing: 'normal' }}>(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {householdLanguageOptions.slice(0, showAllLangs ? undefined : 8).map(lang => (
                    <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                      className="px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200"
                      style={formData.languageRequirements.includes(lang)
                        ? { backgroundColor: '#2814ff', color: '#ffffff' }
                        : { backgroundColor: '#eeeeff', color: '#6e6e73' }
                      }>
                      {lang}
                    </button>
                  ))}
                </div>
                {householdLanguageOptions.length > 8 && (
                  <button type="button" onClick={() => setShowAllLangs(!showAllLangs)}
                    className="mt-2 text-xs hover:opacity-75 transition-opacity" style={{ color: '#a1a1a6' }}>
                    {showAllLangs ? 'Show less' : `+ ${householdLanguageOptions.length - 8} more`}
                  </button>
                )}
              </div>
            )}

            {/* Travel */}
            <div>
              <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Travel Requirements</label>
              <CustomSelect name="travelRequirement" value={formData.travelRequirement} onChange={handleInputChange}
                options={travelOptions} placeholder="Select travel requirement" />
            </div>
          </div>
        )}

        {/* Step 4: Finalize */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-semibold mb-1" style={{ color: '#1d1d1f' }}>Almost there</h3>
              <p className="text-sm" style={{ color: '#6e6e73' }}>A few final details to sharpen your analysis.</p>
            </div>

            {/* Summary */}
            <div className="rounded-btn p-4" style={{ backgroundColor: '#eeeeff' }}>
              <h4 className="font-medium text-sm mb-1" style={{ color: '#1d1d1f' }}>Your report will include</h4>
              <p className="text-xs leading-relaxed" style={{ color: '#6e6e73' }}>Salary benchmarks, search complexity score, sourcing strategy, candidate availability, and market positioning — all tailored to your specific search.</p>
            </div>

            {/* Contextual fields */}
            {isPortfolioRole ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Deal Stage</label>
                    <CustomSelect name="dealStage" value={formData.dealStage} onChange={handleInputChange}
                      options={dealStageOptions} placeholder="Select deal stage..." />
                    {formData.dealStage && (
                      <p className="mt-1 text-xs" style={{ color: '#a1a1a6' }}>
                        {dealStageOptions.find(o => o.value === formData.dealStage)?.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Governance Structure</label>
                    <CustomSelect name="governanceType" value={formData.governanceType} onChange={handleInputChange}
                      options={governanceOptions} placeholder="Select governance..." />
                    {formData.governanceType && (
                      <p className="mt-1 text-xs" style={{ color: '#a1a1a6' }}>
                        {governanceOptions.find(o => o.value === formData.governanceType)?.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Co-Investor Structure</label>
                    <CustomSelect name="coInvestorType" value={formData.coInvestorType} onChange={handleInputChange}
                      options={coInvestorOptions} placeholder="Select co-investor type..." />
                    {formData.coInvestorType && (
                      <p className="mt-1 text-xs" style={{ color: '#a1a1a6' }}>
                        {coInvestorOptions.find(o => o.value === formData.coInvestorType)?.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Team Size</label>
                    <CustomSelect name="teamSize" value={formData.teamSize} onChange={handleInputChange}
                      options={[
                        { value: '0', label: 'Individual contributor' },
                        { value: '1-3', label: '1-3 reports' },
                        { value: '4-10', label: '4-10 reports' },
                        { value: '10-plus', label: '10+ reports' },
                      ]} placeholder="Select..." />
                  </div>
                </div>
              </div>
            ) : isCorporateRole ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Assets Under Management</label>
                  <CustomSelect name="aumRange" value={formData.aumRange} onChange={handleInputChange}
                    options={[
                      { value: 'under-100M', label: 'Under $100M' },
                      { value: '100M-300M', label: '$100M - $300M' },
                      { value: '300M-500M', label: '$300M - $500M' },
                      { value: '500M-1B', label: '$500M - $1B' },
                      { value: '1B-plus', label: '$1B+' },
                    ]} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Team Size</label>
                  <CustomSelect name="teamSize" value={formData.teamSize} onChange={handleInputChange}
                    options={[
                      { value: '0', label: 'Individual contributor' },
                      { value: '1-3', label: '1-3 reports' },
                      { value: '4-10', label: '4-10 reports' },
                      { value: '10-plus', label: '10+ reports' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            ) : isMaritimeRole ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                    <span className="flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5" style={{ color: '#a1a1a6' }} />Vessel Length (LOA)</span>
                  </label>
                  <CustomSelect name="yachtLength" value={formData.yachtLength} onChange={handleInputChange}
                    options={[
                      { value: 'under-80ft', label: 'Under 80 ft' },
                      { value: '80-120ft', label: '80 - 120 ft' },
                      { value: '120-160ft', label: '120 - 160 ft' },
                      { value: '160-200ft', label: '160 - 200 ft' },
                      { value: 'over-200ft', label: '200+ ft (Superyacht)' },
                    ]} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Crew Size</label>
                  <CustomSelect name="crewSize" value={formData.crewSize} onChange={handleInputChange}
                    options={[
                      { value: '1-5', label: '1 - 5' },
                      { value: '6-12', label: '6 - 12' },
                      { value: '13-20', label: '13 - 20' },
                      { value: '21-plus', label: '21+' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            ) : isAviationRole ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>
                    <span className="flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" style={{ color: '#a1a1a6' }} />Aircraft Type</span>
                  </label>
                  <CustomSelect name="aircraftType" value={formData.aircraftType} onChange={handleInputChange}
                    options={[
                      { value: 'light-jet', label: 'Light Jet' },
                      { value: 'midsize-jet', label: 'Midsize Jet' },
                      { value: 'super-midsize', label: 'Super-Midsize' },
                      { value: 'heavy-jet', label: 'Heavy Jet' },
                      { value: 'ultra-long-range', label: 'Ultra Long Range' },
                      { value: 'helicopter', label: 'Helicopter' },
                    ]} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Fleet Size</label>
                  <CustomSelect name="fleetSize" value={formData.fleetSize} onChange={handleInputChange}
                    options={[
                      { value: '1', label: '1' },
                      { value: '2-3', label: '2 - 3' },
                      { value: '4-plus', label: '4+' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Properties to Staff</label>
                  <CustomSelect name="propertiesCount" value={formData.propertiesCount} onChange={handleInputChange}
                    options={[
                      { value: '1', label: '1' },
                      { value: '2-3', label: '2-3' },
                      { value: '4-6', label: '4-6' },
                      { value: '7+', label: '7+' },
                    ]} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase mb-2" style={{ letterSpacing: '0.05em', color: '#6e6e73' }}>Household Size</label>
                  <CustomSelect name="householdSize" value={formData.householdSize} onChange={handleInputChange}
                    options={[
                      { value: '1-2', label: '1-2' },
                      { value: '3-5', label: '3-5 (family)' },
                      { value: '6+', label: '6+ (extended)' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3.5 rounded-btn flex items-center gap-2" style={{ backgroundColor: '#fdf2f4', borderLeft: '2px solid #c77d8a' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#9e5f6a' }} />
            <p className="text-sm font-medium" style={{ color: '#9e5f6a' }}>{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-btn font-medium text-sm transition-opacity hover:opacity-88"
              style={{ border: '1px solid #d2d2d7', color: '#1d1d1f', backgroundColor: 'transparent' }}>
              Back
            </button>
          ) : <div />}

          <button onClick={step === 4 ? calculateComplexity : nextStep} disabled={loading}
            className="text-white px-6 py-3 rounded-btn font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-opacity hover:opacity-88"
            style={{ backgroundColor: '#2814ff' }}>
            {step === 4 ? (
              <><Target className="w-4 h-4" />Get Analysis</>
            ) : (
              <>Continue<ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
