import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { BENCHMARKS, REGIONAL_MULTIPLIERS, getPositionsByCategory, getAllPositionNames, getBenchmark, CATEGORY_GROUPS } from '../salaryData';
import {
  REGIONAL_ADJUSTMENTS,
  LOCATION_SUGGESTIONS,
  getSeasonalityFactor,
  sanitizeForPrompt,
  timelineOptions,
  householdBudgetRanges,
  corporateBudgetRanges,
  discretionLevels,
  householdLanguageOptions,
  corporateLanguageOptions,
  householdCertificationOptions,
  corporateCertificationOptions,
  travelOptions,
  corporateLanguageShortList,
  APP_VERSION
} from './constants';

console.log(`Search Calculator v${APP_VERSION} - With Role Comparison, Shareable Links, What-If Sliders, Email Reports`);

function useDebounce(value, delay = 150) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function useSearchEngine() {
  // State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    positionType: '',
    location: '',
    timeline: '',
    budgetRange: '',
    keyRequirements: '',
    email: '',
    emailConsent: false,
    discretionLevel: 'standard',
    propertiesCount: '',
    householdSize: '',
    priorityCallback: false,
    phone: '',
    languageRequirements: [],
    certifications: [],
    travelRequirement: 'minimal',
    aumRange: '',
    teamSize: '',
    yachtLength: '',
    crewSize: '',
    aircraftType: '',
    fleetSize: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(-1);
  const [positionSearch, setPositionSearch] = useState('');
  const [showPositionSuggestions, setShowPositionSuggestions] = useState(false);
  const [highlightedPositionIndex, setHighlightedPositionIndex] = useState(-1);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showRoleComparison, setShowRoleComparison] = useState(false);
  const [comparisonRoles, setComparisonRoles] = useState([]);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [whatIfMode, setWhatIfMode] = useState(false);
  const [whatIfBudget, setWhatIfBudget] = useState('');
  const [whatIfTimeline, setWhatIfTimeline] = useState('');
  const [whatIfBudgetAmount, setWhatIfBudgetAmount] = useState(null); // Dollar slider value
  const [whatIfLanguages, setWhatIfLanguages] = useState(null); // null = use original
  const [whatIfTravel, setWhatIfTravel] = useState(null);
  const [whatIfDiscretion, setWhatIfDiscretion] = useState(null);
  const [whatIfCerts, setWhatIfCerts] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForReport, setEmailForReport] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Refs
  const resultsRef = useRef(null);
  const prevIsCorporateRole = useRef(false);

  // Memos
  const positionsByCategory = useMemo(() => getPositionsByCategory(), []);
  const commonRoles = useMemo(() => getAllPositionNames(), []);

  const filteredPositions = useMemo(() => {
    if (!positionSearch.trim()) return commonRoles;
    const q = positionSearch.toLowerCase();
    return commonRoles.filter(role => role.toLowerCase().includes(q));
  }, [positionSearch, commonRoles]);

  const isCorporateRole = useMemo(() => {
    if (!formData.positionType) return false;
    const benchmark = getBenchmark(formData.positionType);
    return benchmark?.category?.startsWith('Family Office -');
  }, [formData.positionType]);

  const isMaritimeRole = useMemo(() => {
    if (!formData.positionType) return false;
    const benchmark = getBenchmark(formData.positionType);
    return benchmark?.category === 'Maritime / Yacht';
  }, [formData.positionType]);

  const isAviationRole = useMemo(() => {
    if (!formData.positionType) return false;
    const name = formData.positionType.toLowerCase();
    return name.includes('pilot') || name.includes('flight attendant') || name.includes('aviation');
  }, [formData.positionType]);

  const budgetRanges = isCorporateRole ? corporateBudgetRanges : householdBudgetRanges;

  const debouncedLocation = useDebounce(formData.location, 150);

  const filteredLocationSuggestions = useMemo(() => {
    if (!debouncedLocation) return LOCATION_SUGGESTIONS;
    return LOCATION_SUGGESTIONS.filter(loc => loc.toLowerCase().includes(debouncedLocation.toLowerCase())).slice(0, 8);
  }, [debouncedLocation]);

  // Effects
  useEffect(() => {
    setHighlightedLocationIndex(-1);
  }, [filteredLocationSuggestions]);

  useEffect(() => {
    if (prevIsCorporateRole.current !== isCorporateRole && formData.positionType) {
      setFormData(prev => ({
        ...prev,
        languageRequirements: [],
        certifications: [],
        budgetRange: ''
      }));
    }
    prevIsCorporateRole.current = isCorporateRole;
  }, [isCorporateRole, formData.positionType]);

  // Parse shared link on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('s');
      if (shared) {
        const decoded = JSON.parse(atob(shared));
        setFormData(prev => ({
          ...prev,
          positionType: decoded.p || '',
          location: decoded.l || '',
          timeline: decoded.t || '',
          budgetRange: decoded.b || '',
          discretionLevel: decoded.d || 'standard',
          languageRequirements: decoded.lr || [],
          certifications: decoded.c || [],
          travelRequirement: decoded.tr || 'minimal',
          keyRequirements: decoded.kr || 'Shared analysis - see results below',
          aumRange: decoded.a || '',
          teamSize: decoded.ts || '',
          propertiesCount: decoded.pc || '',
          householdSize: decoded.hs || '',
          yachtLength: decoded.yl || '',
          crewSize: decoded.cs || '',
          aircraftType: decoded.at || '',
          fleetSize: decoded.fs || ''
        }));
        setTimeout(() => {
          setStep(5);
        }, 100);
      }
    } catch (e) {
      // Invalid share link, ignore
    }
  }, []);

  // Show instant deterministic results when loaded from shared link
  useEffect(() => {
    if (step === 5 && formData.positionType) {
      calculateComplexityFromShare();
    }
  }, [step]);

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    setError(null);
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleLocationKeyDown = (e) => {
    if (!showLocationSuggestions || filteredLocationSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedLocationIndex(prev => prev < filteredLocationSuggestions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedLocationIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedLocationIndex >= 0) {
      e.preventDefault();
      setFormData({ ...formData, location: filteredLocationSuggestions[highlightedLocationIndex] });
      setShowLocationSuggestions(false);
      setHighlightedLocationIndex(-1);
    } else if (e.key === 'Escape') {
      setShowLocationSuggestions(false);
      setHighlightedLocationIndex(-1);
    }
  };

  // Validation
  const validateAndWarn = () => {
    const newWarnings = [];
    const benchmark = BENCHMARKS[formData.positionType];
    const budgetOption = budgetRanges.find(b => b.value === formData.budgetRange);
    const regional = Object.entries(REGIONAL_ADJUSTMENTS).find(([key]) => formData.location.toLowerCase().includes(key.toLowerCase()));

    if (benchmark && budgetOption && budgetOption.midpoint) {
      const adjustedP25 = benchmark.p25 * (regional?.[1]?.multiplier || 1);
      const adjustedP50 = benchmark.p50 * (regional?.[1]?.multiplier || 1);

      if (budgetOption.midpoint < adjustedP25 * 0.85) {
        newWarnings.push({
          type: 'critical',
          message: `Budget is significantly below market for ${formData.positionType} in ${formData.location || 'this market'}.`,
          suggestion: `Suggested minimum: $${Math.round(adjustedP25/1000)}k`
        });
      }

      if (regional?.[1]?.tier === 'ultra-high' && budgetOption.midpoint < adjustedP50) {
        newWarnings.push({
          type: 'warning',
          message: `${regional[0]} is an ultra-high cost market. Your budget may limit the candidate pool.`,
          suggestion: `Market median with regional adjustment: $${Math.round(adjustedP50/1000)}k`
        });
      }
    }

    if (formData.positionType === 'Chief of Staff' && formData.budgetRange === 'under-80k') {
      newWarnings.push({
        type: 'critical',
        message: "A Chief of Staff under $80k is extremely rare in the UHNW space.",
        suggestion: "Consider a Personal Assistant role at this budget, or increase to $180k+ for a true Chief of Staff."
      });
    }

    if (formData.timeline === 'immediate' && formData.languageRequirements.length >= 2) {
      newWarnings.push({
        type: 'warning',
        message: "Multiple language requirements on an immediate timeline is extremely challenging.",
        suggestion: "Consider extending timeline or prioritizing one language."
      });
    }

    const seasonality = getSeasonalityFactor();
    if (seasonality.factor > 1.1 && formData.timeline === 'immediate') {
      newWarnings.push({
        type: 'info',
        message: seasonality.label,
        suggestion: "Factor in additional 2-4 weeks for holiday slowdown."
      });
    }

    setWarnings(newWarnings);
    return newWarnings.filter(w => w.type === 'critical').length === 0;
  };

  const validateStep = () => {
    if (step === 1 && (!formData.positionType || !formData.location)) {
      setError('Please complete all required fields');
      return false;
    }
    if (step === 2 && (!formData.timeline || !formData.budgetRange)) {
      setError('Please select timeline and budget range');
      return false;
    }
    if (step === 3 && formData.keyRequirements.length < 25) {
      setError('Key requirements should be at least 25 characters.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 2) validateAndWarn();
      setStep(step + 1);
      setError(null);
    }
  };

  // Scoring
  const calculateDeterministicScore = (budgetOverride = null, timelineOverride = null, overrides = {}) => {
    let points = 0;
    const drivers = [];
    const assumptions = [];
    const redFlags = [];
    const langOverride = overrides.languages !== undefined ? overrides.languages : null;
    const travelOverride = overrides.travel !== undefined ? overrides.travel : null;
    const discretionOverride = overrides.discretion !== undefined ? overrides.discretion : null;
    const certOverride = overrides.certs !== undefined ? overrides.certs : null;
    const budgetAmountOverride = overrides.budgetAmount !== undefined ? overrides.budgetAmount : null;

    // Timeline
    const timelineValue = timelineOverride || formData.timeline;
    const timelineOption = timelineOptions.find(t => t.value === timelineValue);
    if (timelineOption) {
      points += timelineOption.points;
      drivers.push({ factor: "Client Timeline", points: timelineOption.points, rationale: timelineOption.label, tooltip: timelineOption.description });
    }

    // Location
    const isFlexible = /(remote|multiple|anywhere)/i.test(formData.location);
    let locationPoints = isFlexible ? 4 : 12;
    let regionalData = null;

    for (const [region, data] of Object.entries(REGIONAL_ADJUSTMENTS)) {
      if (formData.location.toLowerCase().includes(region.toLowerCase())) {
        regionalData = { region, ...data };
        if (data.tier === 'ultra-high') locationPoints += 5;
        else if (data.tier === 'high') locationPoints += 3;
        break;
      }
    }
    points += locationPoints;
    drivers.push({ factor: "Location", points: locationPoints, rationale: regionalData ? `${regionalData.region} (${regionalData.label})` : (isFlexible ? "Flexible" : "Single location") });

    // Budget
    const budgetOption = budgetRanges.find(b => b.value === (budgetOverride || formData.budgetRange));
    const benchmark = BENCHMARKS[formData.positionType];
    let budgetPoints = 14;
    let budgetRationale = "Unknown";

    // Use direct dollar amount if provided via What-If slider, otherwise use budget range midpoint
    const effectiveMidpoint = budgetAmountOverride !== null ? budgetAmountOverride : budgetOption?.midpoint;

    if (benchmark && effectiveMidpoint) {
      const multiplier = regionalData?.multiplier || 1;
      const adjP50 = benchmark.p50 * multiplier;
      const adjP75 = benchmark.p75 * multiplier;
      const ratio = effectiveMidpoint / adjP50;

      if (ratio >= 1.5) {
        budgetPoints = 0;
        budgetRationale = "Well above 75th percentile - premium offer";
      } else if (ratio >= 1.2) {
        budgetPoints = 5;
        budgetRationale = "Above 75th percentile - highly competitive";
      } else if (ratio >= 1.0) {
        budgetPoints = 12;
        budgetRationale = "At or above median - competitive";
      } else if (ratio >= 0.85) {
        budgetPoints = 20;
        budgetRationale = "Slightly below median - may limit pool";
      } else if (ratio >= 0.7) {
        budgetPoints = 28;
        budgetRationale = "Below market - significant constraint";
      } else {
        budgetPoints = 35;
        budgetRationale = "Well below market - major red flag";
        redFlags.push("Budget below market");
      }
      assumptions.push(`Regional adjustment: ${regionalData?.label || 'Standard'} (${multiplier}x)`);
    } else if ((budgetOverride || formData.budgetRange) === 'not-sure') {
      budgetRationale = "Budget TBD - needs guidance";
    }
    points += budgetPoints;
    drivers.push({ factor: "Budget", points: budgetPoints, rationale: budgetRationale });

    // Languages
    const activeLangs = langOverride !== null ? langOverride : formData.languageRequirements;
    const langCount = activeLangs.length;
    let langPoints = langCount === 1 ? 5 : langCount === 2 ? 12 : langCount >= 3 ? 20 : 0;
    if (langPoints > 0) {
      points += langPoints;
      drivers.push({ factor: "Languages", points: langPoints, rationale: langCount === 1 ? activeLangs[0] : `${langCount} languages (compound rarity)` });
    }

    // Travel
    const activeTravelValue = travelOverride !== null ? travelOverride : formData.travelRequirement;
    const travelOpt = travelOptions.find(t => t.value === activeTravelValue);
    if (travelOpt?.points > 0) {
      points += travelOpt.points;
      drivers.push({ factor: "Travel", points: travelOpt.points, rationale: travelOpt.label });
    }

    // Certifications
    const activeCerts = certOverride !== null ? certOverride : formData.certifications;
    const certCount = activeCerts.length;
    if (certCount > 0) {
      const certPoints = certCount === 1 ? 4 : 8 + (certCount - 2) * 3;
      points += certPoints;
      drivers.push({ factor: "Certifications", points: certPoints, rationale: `${certCount} required` });
    }

    // Discretion
    const activeDiscretion = discretionOverride !== null ? discretionOverride : formData.discretionLevel;
    const discOption = discretionLevels.find(d => d.value === activeDiscretion);
    if (discOption?.points > 0) {
      points += discOption.points;
      drivers.push({ factor: "Discretion", points: discOption.points, rationale: discOption.label });
    }

    // Seasonality
    const seasonality = getSeasonalityFactor();
    const seasonalPoints = Math.round((seasonality.factor - 1) * 50);
    if (seasonalPoints !== 0) {
      points += seasonalPoints;
      drivers.push({ factor: "Seasonal Timing", points: seasonalPoints, rationale: seasonality.label });
    }

    // Role scarcity
    const roleScarcity = benchmark?.scarcity || 5;
    const rolePoints = Math.round(roleScarcity);
    points += rolePoints;
    drivers.push({ factor: "Role Scarcity", points: rolePoints, rationale: `${formData.positionType} (${roleScarcity}/10)` });

    // Market demand trend
    if (benchmark?.demandTrend) {
      const { direction, yoyChange } = benchmark.demandTrend;
      let demandPoints = 0;
      let demandRationale = '';
      if (direction === 'growing' && yoyChange >= 0.15) {
        demandPoints = 7;
        demandRationale = `Rapidly growing demand (+${Math.round(yoyChange * 100)}% YoY)`;
      } else if (direction === 'growing' && yoyChange >= 0.08) {
        demandPoints = 4;
        demandRationale = `Growing demand (+${Math.round(yoyChange * 100)}% YoY)`;
      } else if (direction === 'growing') {
        demandPoints = 2;
        demandRationale = `Modest growth (+${Math.round(yoyChange * 100)}% YoY)`;
      } else if (direction === 'declining') {
        demandPoints = -3;
        demandRationale = `Declining demand (${Math.round(yoyChange * 100)}% YoY)`;
      } else {
        demandPoints = 0;
        demandRationale = 'Stable market demand';
      }
      if (demandPoints !== 0) {
        points += demandPoints;
        drivers.push({ factor: "Market Demand", points: demandPoints, rationale: demandRationale });
      }
    }

    const score = Math.min(10, Math.max(1, Math.round(1 + (points / 130) * 9)));
    const label = score <= 3 ? "Straightforward" : score <= 5 ? "Moderate" : score <= 7 ? "Challenging" : score <= 9 ? "Highly Complex" : "Exceptional";
    const confidence = (budgetOverride || formData.budgetRange) === 'not-sure' || !benchmark ? "Medium" : "High";

    return { score, label, points, drivers, confidence, assumptions, redFlags, regionalData, benchmark, seasonality };
  };

  // API call
  const fetchWithRetry = async (url, options, maxRetries = 1) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s — large AI prompt needs time
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }
        lastError = new Error(`Server error: ${response.status}`);
      } catch (err) {
        lastError = err;
      }
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw lastError;
  };

  // AI Analysis
  const calculateComplexity = async () => {
    setLoading(true);
    setLoadingStep(1);
    setError(null);

    const det = calculateDeterministicScore();
    const displayTitle = formData.positionType;
    const benchmark = det.benchmark;

    const timelineOption = timelineOptions.find(t => t.value === formData.timeline);
    const budgetOption = budgetRanges.find(b => b.value === formData.budgetRange);

    const regionalMultiplier = det.regionalData?.multiplier || 1;
    const adjustedBenchmark = benchmark ? {
      p25: Math.round(benchmark.p25 * regionalMultiplier),
      p50: Math.round(benchmark.p50 * regionalMultiplier),
      p75: Math.round(benchmark.p75 * regionalMultiplier)
    } : null;

    // Discretion context for prompt enrichment
    const discOption = discretionLevels.find(d => d.value === formData.discretionLevel);

    // Brief pause so user sees loading state
    await new Promise(r => setTimeout(r, 400));

    try {
      setLoadingStep(2);

      const prompt = `Analyze this UHNW search for a Talent Gurus client. Return detailed, actionable JSON only — no preamble, no explanation. Before generating, mentally verify that salary, timeline, pool size, and probability are internally consistent.

=== SEARCH PARAMETERS ===
Position: ${displayTitle}
Location: ${sanitizeForPrompt(formData.location)}${det.regionalData ? ` (${det.regionalData.label}, ${regionalMultiplier}x cost multiplier)` : ''}
Client Timeline: ${timelineOption?.label || sanitizeForPrompt(formData.timeline)}
Client Budget: ${budgetOption?.label || sanitizeForPrompt(formData.budgetRange)}
Requirements: ${sanitizeForPrompt(formData.keyRequirements)}
Languages: ${formData.languageRequirements.map(l => sanitizeForPrompt(l)).join(', ') || 'None specified'}
Certifications: ${formData.certifications.map(c => sanitizeForPrompt(c)).join(', ') || 'None specified'}
Travel: ${sanitizeForPrompt(formData.travelRequirement)}
Discretion: ${discOption?.label || sanitizeForPrompt(formData.discretionLevel)} — ${discOption?.description || 'Normal confidentiality'}${formData.discretionLevel !== 'standard' ? ' ⚠ This significantly affects sourcing approach, candidate pool, and timeline.' : ''}
${isCorporateRole && formData.aumRange ? `AUM Range: ${sanitizeForPrompt(formData.aumRange)}` : ''}
${isCorporateRole && formData.teamSize ? `Team Size: ${sanitizeForPrompt(formData.teamSize)}` : ''}
${isMaritimeRole && formData.yachtLength ? `Yacht Length: ${sanitizeForPrompt(formData.yachtLength)}` : ''}
${isMaritimeRole && formData.crewSize ? `Crew Size: ${sanitizeForPrompt(formData.crewSize)}` : ''}
${isAviationRole && formData.aircraftType ? `Aircraft Type: ${sanitizeForPrompt(formData.aircraftType)}` : ''}
${isAviationRole && formData.fleetSize ? `Fleet Size: ${sanitizeForPrompt(formData.fleetSize)}` : ''}
${!isCorporateRole && !isMaritimeRole && !isAviationRole && formData.propertiesCount ? `Properties: ${sanitizeForPrompt(formData.propertiesCount)}` : ''}
${!isCorporateRole && !isMaritimeRole && !isAviationRole && formData.householdSize ? `Household Size: ${sanitizeForPrompt(formData.householdSize)}` : ''}
Computed Complexity Score: ${det.score}/10 (${det.label})

=== MARKET DATA (use these exact figures) ===
${adjustedBenchmark ? `Regionally-Adjusted Salary for ${formData.location || 'this market'}:
  25th Percentile: $${adjustedBenchmark.p25.toLocaleString()}
  Median (50th): $${adjustedBenchmark.p50.toLocaleString()}
  75th Percentile: $${adjustedBenchmark.p75.toLocaleString()}` : 'No benchmark available. Any salary guidance MUST include the disclaimer: "This is an estimated range based on comparable roles — we recommend validating with current market data." Do NOT present estimates as benchmarked figures.'}
${benchmark?.benefits ? `Benefits: Housing: ${benchmark.benefits.housing} | Vehicle: ${benchmark.benefits.vehicle} | Health: ${benchmark.benefits.health} | Bonus: ${benchmark.benefits.bonus}` : ''}
${benchmark?.scarcity ? `Role Scarcity: ${benchmark.scarcity}/10` : ''}
${benchmark?.timeToFill ? `Time to Fill: ${benchmark.timeToFill} weeks (baseline — adjust for this search's complexity)` : ''}
${benchmark?.candidatePoolSize ? `National Candidate Pool: ${benchmark.candidatePoolSize}` : ''}
${benchmark?.turnover ? `Tenure: ${benchmark.turnover.avgTenure} yrs avg | Turnover: ${Math.round(benchmark.turnover.annualTurnover * 100)}%/yr` : ''}
${benchmark?.demandTrend ? `Demand: ${benchmark.demandTrend.direction} (${benchmark.demandTrend.yoyChange >= 0 ? '+' : ''}${Math.round(benchmark.demandTrend.yoyChange * 100)}% YoY)` : ''}
${benchmark?.offerAcceptanceRate ? `Offer Acceptance: ${Math.round(benchmark.offerAcceptanceRate * 100)}% (expect ~${(1 / benchmark.offerAcceptanceRate).toFixed(1)} candidates per placement)` : ''}
${benchmark?.counterOfferRate ? `Counter-Offer Rate: ${Math.round(benchmark.counterOfferRate * 100)}%` : ''}
${benchmark?.sourcingChannels ? `Sourcing Mix: Referral ${Math.round(benchmark.sourcingChannels.referral * 100)}% | Search Firm like TG ${Math.round(benchmark.sourcingChannels.agency * 100)}% | Direct Outreach ${Math.round(benchmark.sourcingChannels.direct * 100)}% | Internal ${Math.round(benchmark.sourcingChannels.internal * 100)}%` : ''}
${benchmark?.salaryGrowthRate ? `Salary Growth: ${Math.round(benchmark.salaryGrowthRate * 100)}% YoY` : ''}
${benchmark?.typicalExperience ? `Experience: ${benchmark.typicalExperience.min}–${benchmark.typicalExperience.typical} years typical` : ''}
${benchmark?.retentionRisk ? `First-Year Attrition: ${Math.round(benchmark.retentionRisk.firstYearAttrition * 100)}% — reasons: ${benchmark.retentionRisk.topReasons.join(', ')}` : ''}
${benchmark?.compensationStructure ? `Comp Split: Base ${Math.round(benchmark.compensationStructure.basePercent * 100)}% | Bonus ${Math.round(benchmark.compensationStructure.bonusPercent * 100)}% | Benefits ${Math.round(benchmark.compensationStructure.benefitsPercent * 100)}% — Signing bonus in ${Math.round(benchmark.compensationStructure.signingBonusFrequency * 100)}% of placements ($${benchmark.compensationStructure.signingBonusRange})` : ''}
${benchmark?.relocationWillingness !== undefined ? `Relocation: ${Math.round(benchmark.relocationWillingness * 100)}% willing — ${benchmark.relocationWillingness < 0.35 ? 'severely limits non-local searches' : benchmark.relocationWillingness < 0.50 ? 'meaningfully constrains non-local searches' : 'reasonable mobility'}` : ''}
${benchmark?.backgroundCheckTimeline ? `Due Diligence: ${benchmark.backgroundCheckTimeline} weeks typical vetting` : ''}
${benchmark?.trends ? `Market Context: ${benchmark.trends}` : ''}
${benchmark?.regionalNotes ? `Regional Notes: ${benchmark.regionalNotes}` : ''}

=== DATA USAGE ===
- SALARY: Use adjusted percentiles above. State as "$Xk–$Yk base + Z% bonus." Factor budget position.
- TIMELINE: Start from Time to Fill, add due diligence (${benchmark?.backgroundCheckTimeline || 2}w) + counter-offer risk (${benchmark?.counterOfferRate ? Math.round(benchmark.counterOfferRate * 100) + '%' : '~25%'}). Break into phases.
- SOURCING: Reference channel percentages. Name WHERE candidates come from — never "use multiple channels."
- POOL: ${benchmark?.relocationWillingness !== undefined ? `${Math.round(benchmark.relocationWillingness * 100)}% relocate. ` : ''}${benchmark?.candidatePoolSize ? `Pool ~${benchmark.candidatePoolSize}. ` : ''}Flag estimated pool sizes as "estimated."
- DISCRETION: ${formData.discretionLevel === 'standard' ? 'Standard — no constraints.'
  : formData.discretionLevel === 'elevated' ? 'Elevated (NDA). Standard UHNW practice, NOT a major constraint. Add 0–1 weeks.'
    : formData.discretionLevel === 'high-profile' ? 'High-Profile. No public postings, referral-heavy. Shrinks pool 20–30%, adds 2–3 weeks.'
      : 'Ultra-Discrete (blind search). Referral only. Eliminates 40%+, adds 3–4 weeks, may need higher comp.'}

=== GUARDRAILS ===
1. COMPLEXITY ${det.score}/10 is a FACT, not a goal. MANDATE STRENGTH (1–10) reflects client position. PROBABILITY must be consistent: high complexity + weak mandate = lower probability. Derive probability AFTER assessing mandate.
2. TRADE-OFFS: Concrete IF/THEN with real numbers. "If you move from $180k to $220k, pool roughly doubles."
3. FALSE SIGNALS and CANDIDATE PSYCHOLOGY must be specific to ${displayTitle} in ${formData.location || 'this market'}, not generic.
4. NO HALLUCINATED DATA: Use exact figures provided. Missing data = "estimated." Never invent statistics.
5. NO FABRICATED RELATIONSHIPS: Never name specific orgs/schools/guilds as TG partners. Use generic categories only ("butler training alumni" not "Starkey International").
6. COMMON SENSE: Core job functions are table stakes, not filters. Only non-standard requirements (rare certs, specific languages, unusual geography) genuinely shrink pools.
7. Each JSON field must add NEW info — no restating between sections. Numbers must be consistent everywhere.

=== RETURN THIS JSON (be concise — 1–2 sentences per field unless noted) ===
{
  "salaryRangeGuidance": "$Xk–$Yk base + bonus. Why, referencing percentiles and budget.${isCorporateRole && formData.aumRange ? ' Factor AUM.' : ''}",
  "estimatedTimeline": "X–Y weeks. Phases: sourcing, interviews, offer, due diligence.",
  "marketCompetitiveness": "Favorable or challenging? What drives competition? No YoY claims without data.",
  "keySuccessFactors": ["Barrier that kills this search if unaddressed", "Constraint that most shrinks pool", "Signal a candidate wants THIS role specifically"],
  "recommendedAdjustments": ["IF/THEN with $$ numbers. 1–3 items or empty []."],
  "candidateAvailability": "Abundant|Moderate|Limited|Rare",
  "availabilityReason": "Why — pool size, filters, what shrinks it.",
  "sourcingInsight": "Where candidates come from. Use channel types (referral, direct outreach, professional communities) — never name specific orgs as TG partners.",
  "negotiationLeverage": {
    "candidateAdvantages": ["Leverage + dollar impact"],
    "employerAdvantages": ["Advantage + impact"]
  },
  "redFlagAnalysis": "Problem, impact, options. Or 'None — well-positioned.'",
  "bottomLine": "3 sentences: verdict, what client underestimates, next step.",
  "decisionIntelligence": {
    "tradeoffScenarios": {
      "initial": ["IF [change with $$] THEN [outcome]", "IF [second] THEN [outcome]"]
    },
    "candidatePsychology": {
      "initial": ["Real trigger to move", "Unspoken concern that kills offers", "What makes them leave current role"]
    },
    "probabilityOfSuccess": {
      "initialLabel": "Low|Moderate|High",
      "initialConfidence": "X% fill probability — primary factor. Low<35%, Moderate 35–65%, High>65%."
    },
    "mandateStrength": {
      "initial": {
        "score": "NUMBER 1.0–10.0. Don't default to 7–8.",
        "rationale": "What's strong and weak. Reference numbers."
      }
    },
    "falseSignals": {
      "initial": ["Misleading signal for ${displayTitle}", "Signal specific to ${formData.location || 'this market'}", "Process misread risk"]
    }
  },
  "whatsNext": {
    "intro": "1 sentence: what client has, what comes next.",
    "discoveryCall": "Topics for a ${displayTitle} discovery call.${formData.discretionLevel !== 'standard' ? ' Factor ' + (discOption?.label || formData.discretionLevel) + ' discretion.' : ''}",
    "sourcingStrategy": "How WE source this role — our networks, outreach. Never name specific orgs as partners.${formData.discretionLevel !== 'standard' ? ' Factor discretion into channel selection.' : ''}",
    "shortlist": "What vetting focuses on for THIS role.",
    "placementSupport": "Key offer-process risks. No TG service promises."
  }
}`;

      await new Promise(r => setTimeout(r, 300));
      setLoadingStep(3);

      const response = await fetchWithRetry("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, roleType: isCorporateRole ? 'corporate' : 'household' })
      }, 1);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      setLoadingStep(4);

      const data = await response.json();
      let text = data.content?.[0]?.text || '';
      text = text.trim().replace(/^```(?:json)?\s*/gi, '').replace(/\s*```$/gi, '').trim();

      // Robust JSON extraction — handle potential preamble or trailing text
      if (!text.startsWith('{')) {
        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) text = text.substring(jsonStart);
      }
      if (!text.endsWith('}')) {
        const jsonEnd = text.lastIndexOf('}');
        if (jsonEnd !== -1) text = text.substring(0, jsonEnd + 1);
      }

      const ai = JSON.parse(text);

      if (!ai.salaryRangeGuidance || !ai.bottomLine) {
        throw new Error('Incomplete response from AI');
      }

      // Normalize AI response data
      if (ai.decisionIntelligence?.mandateStrength?.initial?.score != null) {
        const score = parseFloat(ai.decisionIntelligence.mandateStrength.initial.score);
        if (!isNaN(score)) ai.decisionIntelligence.mandateStrength.initial.score = Math.min(10, Math.max(1, score));
      }
      if (ai.decisionIntelligence?.probabilityOfSuccess?.initialLabel) {
        ai.decisionIntelligence.probabilityOfSuccess.initialLabel =
          ai.decisionIntelligence.probabilityOfSuccess.initialLabel.replace(/\s*\(.*?\)\s*/g, '').replace(/[^a-zA-Z]/g, '').trim();
      }

      // Generate completeTeaser fields client-side (saves AI output tokens)
      if (ai.decisionIntelligence) {
        const di = ai.decisionIntelligence;
        if (di.tradeoffScenarios) di.tradeoffScenarios.completeTeaser = `Your analysis identified ${det.score >= 7 ? 'several high-impact levers' : 'key optimization opportunities'} — the full assessment models how each budget/timeline/requirement change shifts your fill probability and candidate quality for this ${displayTitle} search.`;
        if (di.candidatePsychology) di.candidatePsychology.completeTeaser = `For ${displayTitle} searches in ${formData.location || 'this market'}, the full analysis includes positioning language that addresses these specific motivators, plus objection-handling frameworks for the counter-offer conversation.`;
        if (di.probabilityOfSuccess) di.probabilityOfSuccess.completeTeaser = `The full analysis maps exactly which single adjustment (budget, timeline, or requirements) has the highest probability impact for this specific ${displayTitle} search — typically worth 15–25 percentage points.`;
        if (di.mandateStrength) di.mandateStrength.completeTeaser = `The full assessment breaks your mandate into 12 dimensions with specific action items — most clients find 2–3 adjustments that materially strengthen their position before sourcing begins.`;
        if (di.falseSignals) di.falseSignals.completeTeaser = `For ${displayTitle} roles, the full analysis includes screening questions that surface these signals early — saves 2–3 weeks of wasted interviews.`;
      }

      setResults({
        ...det,
        ...ai,
        displayTitle,
        formData: { ...formData },
        aiAnalysisSuccess: true,
        adjustedBenchmark,
        regionalMultiplier
      });

    } catch (err) {
      console.error('AI analysis error:', err.message);

      const fallbackSalary = adjustedBenchmark
        ? `$${Math.round(adjustedBenchmark.p25/1000)}k - $${Math.round(adjustedBenchmark.p75/1000)}k for ${formData.location || 'this market'}`
        : "Contact us for guidance";

      setResults({
        ...det,
        displayTitle,
        salaryRangeGuidance: fallbackSalary,
        estimatedTimeline: timelineOption?.label || (formData.timeline === 'immediate' ? "6-10 weeks"
          : formData.timeline === 'standard' ? "8-12 weeks"
          : "10-16 weeks"),
        marketCompetitiveness: det.score <= 4
          ? "Favorable conditions for this search"
          : det.score <= 7
          ? "Competitive market - strategic approach recommended"
          : "Challenging search - expect extended timeline",
        keySuccessFactors: [
          "Competitive total compensation package",
          "Clear role definition and expectations",
          "Efficient interview and decision process"
        ],
        recommendedAdjustments: det.redFlags?.length > 0
          ? det.redFlags.map(flag => `Address: ${flag}`)
          : [],
        candidateAvailability: det.score <= 4 ? "Moderate" : det.score <= 7 ? "Limited" : "Rare",
        availabilityReason: `Based on ${det.drivers?.length || 0} complexity factors analyzed`,
        sourcingInsight: "Schedule a consultation for detailed sourcing strategies tailored to this specific search.",
        negotiationLeverage: {
          candidateAdvantages: det.score >= 6
            ? ["Limited candidate pool", "High market demand"]
            : ["Standard market conditions"],
          employerAdvantages: formData.budgetRange?.includes('350') || formData.budgetRange?.includes('250')
            ? ["Competitive compensation", "Attractive opportunity"]
            : ["Growth opportunity"]
        },
        bottomLine: "This preliminary analysis is based on our scoring algorithm and market benchmarks. For deeper insights tailored to this specific search, schedule a consultation with our team.",
        formData: { ...formData },
        aiAnalysisSuccess: false,
        adjustedBenchmark,
        regionalMultiplier
      });
    }

    // Show all 4 steps complete before hiding
    setLoadingStep(5);
    await new Promise(r => setTimeout(r, 400));
    setLoading(false);
    setLoadingStep(0);
  };

  // Shared link analysis
  const calculateComplexityFromShare = () => {
    const det = calculateDeterministicScore();
    const displayTitle = formData.positionType;
    const benchmark = det.benchmark;
    const regionalMultiplier = det.regionalData?.multiplier || 1;
    const adjustedBenchmark = benchmark ? {
      p25: Math.round(benchmark.p25 * regionalMultiplier),
      p50: Math.round(benchmark.p50 * regionalMultiplier),
      p75: Math.round(benchmark.p75 * regionalMultiplier)
    } : null;

    const fallbackSalary = adjustedBenchmark
      ? `$${Math.round(adjustedBenchmark.p25/1000)}k - $${Math.round(adjustedBenchmark.p75/1000)}k for ${formData.location || 'this market'}`
      : "Contact us for guidance";

    const timelineOption = timelineOptions.find(t => t.value === formData.timeline);

    setResults({
      ...det,
      displayTitle,
      salaryRangeGuidance: fallbackSalary,
      estimatedTimeline: timelineOption?.label || "See full analysis",
      marketCompetitiveness: det.score <= 4
        ? "Favorable conditions for this search"
        : det.score <= 7
        ? "Competitive market - strategic approach recommended"
        : "Challenging search - expect extended timeline",
      keySuccessFactors: [
        "Competitive total compensation package",
        "Clear role definition and expectations",
        "Efficient interview and decision process"
      ],
      recommendedAdjustments: det.redFlags?.length > 0
        ? det.redFlags.map(flag => `Address: ${flag}`)
        : [],
      candidateAvailability: det.score <= 4 ? "Moderate" : det.score <= 7 ? "Limited" : "Rare",
      availabilityReason: `Based on ${det.drivers?.length || 0} complexity factors analyzed`,
      sourcingInsight: "Schedule a consultation for detailed sourcing strategies.",
      negotiationLeverage: {
        candidateAdvantages: det.score >= 6
          ? ["Limited candidate pool", "High market demand"]
          : ["Standard market conditions"],
        employerAdvantages: ["Growth opportunity"]
      },
      bottomLine: "This is a shared analysis based on our scoring algorithm. For AI-powered insights, run a new analysis or schedule a consultation.",
      formData: { ...formData },
      aiAnalysisSuccess: false,
      isSharedResult: true,
      adjustedBenchmark,
      regionalMultiplier
    });
    setStep(1);
  };

  // Budget comparison
  const runComparison = () => {
    const current = calculateDeterministicScore();
    const currentIdx = budgetRanges.findIndex(b => b.value === formData.budgetRange);
    const nextBudget = currentIdx < budgetRanges.length - 2 ? budgetRanges[currentIdx + 1] : null;
    const prevBudget = currentIdx > 0 ? budgetRanges[currentIdx - 1] : null;

    setComparisonResults({
      current,
      withIncrease: nextBudget ? calculateDeterministicScore(nextBudget.value) : null,
      nextLabel: nextBudget?.label,
      withDecrease: prevBudget && prevBudget.midpoint ? calculateDeterministicScore(prevBudget.value) : null,
      prevLabel: prevBudget?.label
    });
    setCompareMode(true);
  };

  // What-If scenarios — always compute when results exist (What-If is always visible)
  const calculateWhatIfScore = useMemo(() => {
    if (!results) return null;
    const budgetVal = whatIfBudget || formData.budgetRange;
    const timelineVal = whatIfTimeline || formData.timeline;
    return calculateDeterministicScore(budgetVal, timelineVal, {
      budgetAmount: whatIfBudgetAmount,
      languages: whatIfLanguages,
      travel: whatIfTravel,
      discretion: whatIfDiscretion,
      certs: whatIfCerts
    });
  }, [whatIfBudget, whatIfTimeline, whatIfBudgetAmount, whatIfLanguages, whatIfTravel, whatIfDiscretion, whatIfCerts, results]);

  // Share URL generation
  const generateShareUrl = () => {
    const shareData = {
      p: formData.positionType,
      l: formData.location,
      t: formData.timeline,
      b: formData.budgetRange,
      d: formData.discretionLevel,
      lr: formData.languageRequirements,
      c: formData.certifications,
      tr: formData.travelRequirement,
      a: formData.aumRange,
      ts: formData.teamSize,
      pc: formData.propertiesCount,
      hs: formData.householdSize,
      yl: formData.yachtLength,
      cs: formData.crewSize,
      at: formData.aircraftType,
      fs: formData.fleetSize,
      kr: formData.keyRequirements
    };
    const encoded = btoa(JSON.stringify(shareData));
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
    setShareUrl(url);
    setShowShareModal(true);
    setCopiedShare(false);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    });
  };

  // Email report
  const handleSendEmail = async () => {
    if (!emailForReport || !emailForReport.includes('@')) return;
    setSendingEmail(true);
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailForReport,
          results: {
            displayTitle: results.displayTitle,
            score: results.score,
            label: results.label,
            location: results.formData?.location,
            bottomLine: results.bottomLine,
            salaryRangeGuidance: results.salaryRangeGuidance,
            estimatedTimeline: results.estimatedTimeline,
            marketCompetitiveness: results.marketCompetitiveness,
            candidateAvailability: results.candidateAvailability,
            availabilityReason: results.availabilityReason,
            keySuccessFactors: results.keySuccessFactors,
            recommendedAdjustments: results.recommendedAdjustments,
            sourcingInsight: results.sourcingInsight,
            redFlagAnalysis: results.redFlagAnalysis,
            negotiationLeverage: results.negotiationLeverage,
            decisionIntelligence: results.decisionIntelligence,
            benchmark: results.benchmark ? {
              p25: results.adjustedBenchmark?.p25 || results.benchmark.p25,
              p50: results.adjustedBenchmark?.p50 || results.benchmark.p50,
              p75: results.adjustedBenchmark?.p75 || results.benchmark.p75,
              trends: results.benchmark.trends,
              regionalNotes: results.benchmark.regionalNotes,
              benefits: results.benchmark.benefits,
              offerAcceptanceRate: results.benchmark.offerAcceptanceRate,
              counterOfferRate: results.benchmark.counterOfferRate,
              sourcingChannels: results.benchmark.sourcingChannels,
              salaryGrowthRate: results.benchmark.salaryGrowthRate,
              typicalExperience: results.benchmark.typicalExperience,
              retentionRisk: results.benchmark.retentionRisk,
              compensationStructure: results.benchmark.compensationStructure,
              relocationWillingness: results.benchmark.relocationWillingness,
              backgroundCheckTimeline: results.benchmark.backgroundCheckTimeline
            } : null,
            drivers: results.drivers,
            regionalMultiplier: results.regionalMultiplier,
            confidence: results.confidence
          }
        })
      });
      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => {
          setShowEmailModal(false);
          setEmailSent(false);
        }, 3000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error('Email error:', err);
      alert('Unable to send email. Please try again.');
    }
    setSendingEmail(false);
  };

  // Reset form
  const resetForm = () => {
    setResults(null);
    setStep(1);
    setPositionSearch('');
    setCompareMode(false);
    setComparisonResults(null);
    setWarnings([]);
    setWhatIfMode(false);
    setWhatIfBudget('');
    setWhatIfTimeline('');
    setWhatIfBudgetAmount(null);
    setWhatIfLanguages(null);
    setWhatIfTravel(null);
    setWhatIfDiscretion(null);
    setWhatIfCerts(null);
    setShareUrl('');
    setShowShareModal(false);
    setShowEmailModal(false);
    setShowRoleComparison(false);
    setComparisonRoles([]);
    setFormData({
      positionType: '', location: '', timeline: '', budgetRange: '', keyRequirements: '',
      email: '', emailConsent: false, discretionLevel: 'standard', propertiesCount: '', householdSize: '',
      priorityCallback: false, phone: '', languageRequirements: [], certifications: [], travelRequirement: 'minimal',
      aumRange: '', teamSize: '', yachtLength: '', crewSize: '', aircraftType: '', fleetSize: ''
    });
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Toggle comparison role
  const toggleComparisonRole = (roleName) => {
    setComparisonRoles(prev => {
      if (prev.includes(roleName)) return prev.filter(r => r !== roleName);
      if (prev.length >= 3) return prev;
      return [...prev, roleName];
    });
  };

  return {
    // State
    step, setStep, formData, setFormData, loading, loadingStep, results, setResults, error, setError,
    warnings, positionSearch, setPositionSearch, showPositionSuggestions, setShowPositionSuggestions,
    highlightedPositionIndex, setHighlightedPositionIndex, filteredPositions, showLocationSuggestions,
    setShowLocationSuggestions, highlightedLocationIndex, setHighlightedLocationIndex,
    filteredLocationSuggestions, compareMode, setCompareMode, comparisonResults,
    showLanguages, setShowLanguages, showRoleComparison, setShowRoleComparison, comparisonRoles,
    shareUrl, showShareModal, setShowShareModal, copiedShare, whatIfMode, setWhatIfMode,
    whatIfBudget, setWhatIfBudget, whatIfTimeline, setWhatIfTimeline,
    whatIfBudgetAmount, setWhatIfBudgetAmount, whatIfLanguages, setWhatIfLanguages,
    whatIfTravel, setWhatIfTravel, whatIfDiscretion, setWhatIfDiscretion,
    whatIfCerts, setWhatIfCerts, showEmailModal,
    setShowEmailModal, emailForReport, setEmailForReport, sendingEmail, emailSent, setEmailSent, resultsRef,
    // Constants
    positionsByCategory, commonRoles, isCorporateRole, isMaritimeRole, isAviationRole, budgetRanges, timelineOptions,
    discretionLevels, householdLanguageOptions, corporateLanguageOptions,
    householdCertificationOptions, corporateCertificationOptions, corporateLanguageShortList,
    travelOptions, CATEGORY_GROUPS, BENCHMARKS,
    // Functions
    handleInputChange, handleMultiSelect, handleLocationKeyDown, validateAndWarn, validateStep,
    nextStep, calculateDeterministicScore, calculateComplexity, calculateComplexityFromShare,
    runComparison, calculateWhatIfScore, generateShareUrl, copyShareUrl, handleSendEmail,
    resetForm, toggleComparisonRole
  };
}
