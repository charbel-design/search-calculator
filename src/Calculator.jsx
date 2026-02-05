import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Download, RefreshCw, Users, Car, Heart, Home, ChevronDown, HelpCircle, Zap, MapPin, Phone, X, Layers, Lightbulb, ArrowLeftRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BENCHMARKS,
  REGIONAL_MULTIPLIERS,
  CATEGORIES,
  CATEGORY_GROUPS,
  SALARY_DATA_META,
  getPositionsByCategory,
  getAllPositionNames,
  detectRegion,
  getBenchmark
} from './salaryData';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Download, RefreshCw, Users, Car, Heart, Home, ChevronDown, HelpCircle, Zap, MapPin, Phone, X, Scale } from 'lucide-react';

// Version indicator - check console to verify deployment version
const APP_VERSION = "2.0.0-enhanced";
console.log(`Search Calculator v${APP_VERSION} - Enhanced with PDF export, trust signals, and improved UX`);

// jsPDF will be loaded via CDN
const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ============================================
// CUSTOM HOOKS
// ============================================

// Debounce hook to limit re-renders during rapid input
function useDebounce(value, delay = 150) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Use the new regional multipliers as REGIONAL_ADJUSTMENTS for backwards compatibility
const REGIONAL_ADJUSTMENTS = REGIONAL_MULTIPLIERS;

// Generate location suggestions from the regional multipliers
const LOCATION_SUGGESTIONS = Object.keys(REGIONAL_MULTIPLIERS).filter(
  loc => !['National_US', 'Midwest_US', 'South_US'].includes(loc)
).map(loc => loc.replace(/_/g, ' '));

// ============================================
// SEASONALITY FACTORS
// ============================================
const getSeasonalityFactor = () => {
  const month = new Date().getMonth();
  if (month >= 9 && month <= 11) return { factor: 1.15, label: "Q4 Holiday Season - Harder to source", description: "Candidates less likely to make moves during holidays" };
  if (month >= 0 && month <= 2) return { factor: 1.05, label: "Q1 - Moderate activity", description: "New year brings some candidate movement" };
  if (month >= 3 && month <= 5) return { factor: 0.95, label: "Q2 Spring - Good timing", description: "Active candidate market" };
  return { factor: 1.0, label: "Q3 Summer - Standard", description: "Normal candidate availability" };
};

// ============================================
// TOOLTIP COMPONENT
// ============================================
const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="cursor-help">
        {children}
      </div>
      {show && (
        <div className="absolute z-50 w-64 p-3 text-xs bg-slate-900 text-white rounded-lg shadow-xl -top-2 left-full ml-2">
          <div className="absolute w-2 h-2 bg-slate-900 transform rotate-45 -left-1 top-4"></div>
          {content}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const SearchComplexityCalculator = () => {
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
    // Corporate family office fields
    aumRange: '',
    teamSize: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(-1);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [showLanguages, setShowLanguages] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (1-2 months)', points: 22, description: 'Rush search - premium sourcing required' },
    { value: 'standard', label: 'Standard (2-3 months)', points: 14, description: 'Typical search timeline' },
    { value: 'flexible', label: 'Flexible (4-6 months)', points: 8, description: 'Time to be selective' },
    { value: 'building-pipeline', label: 'Building Pipeline (6+ months)', points: 3, description: 'Strategic talent mapping' }
  ];

  // Budget ranges - different for household vs corporate roles
  const householdBudgetRanges = [
    { value: 'under-80k', label: 'Under $80k', midpoint: 70000 },
    { value: '80k-120k', label: '$80k - $120k', midpoint: 100000 },
    { value: '120k-180k', label: '$120k - $180k', midpoint: 150000 },
    { value: '180k-250k', label: '$180k - $250k', midpoint: 215000 },
    { value: '250k-350k', label: '$250k - $350k', midpoint: 300000 },
    { value: 'over-350k', label: 'Over $350k', midpoint: 400000 },
    { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
  ];

  const corporateBudgetRanges = [
    { value: 'under-200k', label: 'Under $200k', midpoint: 175000 },
    { value: '200k-350k', label: '$200k - $350k', midpoint: 275000 },
    { value: '350k-500k', label: '$350k - $500k', midpoint: 425000 },
    { value: '500k-750k', label: '$500k - $750k', midpoint: 625000 },
    { value: '750k-1m', label: '$750k - $1M', midpoint: 875000 },
    { value: 'over-1m', label: 'Over $1M', midpoint: 1250000 },
    { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
  ];

  const discretionLevels = [
    { value: 'standard', label: 'Standard', points: 0, description: 'Normal confidentiality' },
    { value: 'elevated', label: 'Elevated - NDA Required', points: 5, description: 'Formal NDA, limited disclosure' },
    { value: 'high-profile', label: 'High-Profile Principal', points: 10, description: 'Public figure, media considerations' },
    { value: 'ultra-discrete', label: 'Ultra-Discrete', points: 15, description: 'Maximum confidentiality, blind search' }
  ];

  // Language options - slightly different focus for corporate vs household
  const householdLanguageOptions = ['English (Native/Fluent)', 'Spanish', 'French', 'Mandarin', 'Tagalog', 'Portuguese', 'Russian', 'Italian', 'German', 'Polish', 'Vietnamese', 'Korean', 'Japanese', 'Arabic', 'Hindi', 'Greek', 'Thai', 'Swedish', 'Dutch', 'Hebrew'];
  const corporateLanguageOptions = ['English (Native/Fluent)', 'Mandarin', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Portuguese', 'Korean', 'Russian', 'Italian', 'Hindi', 'Dutch', 'Swedish', 'Hebrew', 'Cantonese', 'Swiss German', 'Luxembourgish', 'Singaporean English', 'Thai'];

  // Certification options - very different between corporate and household roles
  const householdCertificationOptions = ['STCW (Maritime)', 'CPR/First Aid', 'Firearms License', 'LEOSA', 'Commercial Driver (CDL)', 'Culinary Degree', 'Security Clearance', 'Child Development (CDA)', 'Sommelier (CMS)', 'WSET Level 3/4', 'Certified Wine Educator', 'Cicerone (Beer)', 'ServSafe', 'ENG1 Medical', 'PEC (Yacht)', 'RYA Yachtmaster', 'Butler Training (Starkey/IICS)', 'Nursing License (RN/LPN)', 'Montessori Certification', 'Private Pilot License', 'Close Protection (SIA)', 'AED/BLS Certified', 'Estate Management Certification'];
  const corporateCertificationOptions = ['CFA (Chartered Financial Analyst)', 'Series 7 (General Securities)', 'Series 65/66 (Investment Adviser)', 'CPA (Certified Public Accountant)', 'CFP (Certified Financial Planner)', 'CAIA (Alternative Investments)', 'CTFA (Trust & Fiduciary)', 'CIMA (Investment Management)', 'MBA', 'JD (Law Degree)', 'PMP (Project Management)', 'CISSP (Cybersecurity)', 'FRM (Financial Risk Manager)', 'CMA (Management Accounting)', 'EA (Enrolled Agent)', 'CEBS (Employee Benefits)', 'ChFC (Chartered Financial Consultant)', 'CLU (Chartered Life Underwriter)', 'AAMS (Asset Management)', 'CPWA (Private Wealth Advisor)'];

  // Short language list for corporate roles (optional, collapsed)
  const corporateLanguageShortList = ['Mandarin', 'Spanish', 'German', 'Japanese', 'Arabic', 'French'];
  
  const travelOptions = [
    { value: 'minimal', label: 'Minimal (Local only)', points: 0 },
    { value: 'occasional', label: 'Occasional (1-2 trips/month)', points: 3 },
    { value: 'frequent', label: 'Frequent (Weekly travel)', points: 8 },
    { value: 'heavy-rotation', label: 'Heavy/Rotation (Following principal)', points: 15 }
  ];

  // Get positions grouped by category for the dropdown
  const positionsByCategory = useMemo(() => getPositionsByCategory(), []);
  const commonRoles = useMemo(() => getAllPositionNames(), []);

  // Check if selected position is a corporate family office role
  const isCorporateRole = useMemo(() => {
    if (!formData.positionType) return false;
    const benchmark = getBenchmark(formData.positionType);
    // Check if category starts with "Family Office -" (C-Suite, Investment, Operations, Support)
    return benchmark?.category?.startsWith('Family Office -');
  }, [formData.positionType]);

  // Ref for the results container (used for PDF export)
  const resultsRef = useRef(null);

  // Clear selections when role category changes (budget ranges, certs, languages differ)
  const prevIsCorporateRole = useRef(isCorporateRole);
  useEffect(() => {
    if (prevIsCorporateRole.current !== isCorporateRole && formData.positionType) {
      // Role category changed - clear selections that may not exist in new options
      setFormData(prev => ({
        ...prev,
        languageRequirements: [],
        certifications: [],
        budgetRange: '' // Budget ranges are different for corporate vs household
      }));
    }
    prevIsCorporateRole.current = isCorporateRole;
  }, [isCorporateRole, formData.positionType]);

  // Get the appropriate budget ranges based on role type
  const budgetRanges = isCorporateRole ? corporateBudgetRanges : householdBudgetRanges;

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

  // Debounce location input to reduce autocomplete re-renders
  const debouncedLocation = useDebounce(formData.location, 150);

  const filteredLocationSuggestions = useMemo(() => {
    if (!debouncedLocation) return [];
    return LOCATION_SUGGESTIONS.filter(loc => loc.toLowerCase().includes(debouncedLocation.toLowerCase())).slice(0, 5);
  }, [debouncedLocation]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedLocationIndex(-1);
  }, [filteredLocationSuggestions]);

  // Handle keyboard navigation for location dropdown
  const handleLocationKeyDown = (e) => {
    if (!showLocationSuggestions || filteredLocationSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedLocationIndex(prev =>
        prev < filteredLocationSuggestions.length - 1 ? prev + 1 : prev
      );
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

  // ============================================
  // VALIDATION WITH RED FLAGS
  // ============================================
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

  // ============================================
  // SCORING ALGORITHM
  // ============================================
  const calculateDeterministicScore = (budgetOverride = null) => {
    let points = 0;
    const drivers = [];
    const assumptions = [];
    const redFlags = [];

    // Timeline
    const timelineOption = timelineOptions.find(t => t.value === formData.timeline);
    points += timelineOption.points;
    drivers.push({ factor: "Timeline", points: timelineOption.points, rationale: timelineOption.label, tooltip: timelineOption.description });

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
    if (benchmark && budgetOption?.midpoint) {
      const multiplier = regionalData?.multiplier || 1;
      const adjP25 = benchmark.p25 * multiplier;
      const adjP50 = benchmark.p50 * multiplier;
      const adjP75 = benchmark.p75 * multiplier;

      if (budgetOption.midpoint >= adjP75) {
        budgetPoints = 4;
        budgetRationale = "Above 75th percentile - highly competitive";
      } else if (budgetOption.midpoint >= adjP50) {
        budgetPoints = 10;
        budgetRationale = "At or above median - competitive";
      } else if (budgetOption.midpoint >= adjP25) {
        budgetPoints = 18;
        budgetRationale = "Below median (25th-50th percentile)";
      } else {
        budgetPoints = 25;
        budgetRationale = "Below 25th percentile - limits candidate pool";
        redFlags.push("Budget below market");
      }

      assumptions.push(`Regional adjustment: ${regionalData?.label || 'Standard'} (${multiplier}x)`);
    } else if (formData.budgetRange === 'not-sure') {
      budgetRationale = "Budget TBD - needs guidance";
    }
    points += budgetPoints;
    drivers.push({ factor: "Budget", points: budgetPoints, rationale: budgetRationale });

    // Languages (compound)
    const langCount = formData.languageRequirements.length;
    let langPoints = langCount === 1 ? 5 : langCount === 2 ? 12 : langCount >= 3 ? 20 : 0;
    if (langPoints > 0) {
      points += langPoints;
      drivers.push({ factor: "Languages", points: langPoints, rationale: langCount === 1 ? formData.languageRequirements[0] : `${langCount} languages (compound rarity)` });
    }

    // Travel
    const travelOpt = travelOptions.find(t => t.value === formData.travelRequirement);
    if (travelOpt?.points > 0) {
      points += travelOpt.points;
      drivers.push({ factor: "Travel", points: travelOpt.points, rationale: travelOpt.label });
    }

    // Certifications
    const certCount = formData.certifications.length;
    if (certCount > 0) {
      const certPoints = certCount === 1 ? 4 : 8 + (certCount - 2) * 3;
      points += certPoints;
      drivers.push({ factor: "Certifications", points: certPoints, rationale: `${certCount} required` });
    }

    // Discretion
    const discOption = discretionLevels.find(d => d.value === formData.discretionLevel);
    if (discOption?.points > 0) {
      points += discOption.points;
      drivers.push({ factor: "Discretion", points: discOption.points, rationale: discOption.label });
    }

    // Seasonality
    const seasonality = getSeasonalityFactor();
    const seasonalPoints = Math.round((seasonality.factor - 1) * 50);
    if (seasonalPoints !== 0) {
      points += seasonalPoints;
      drivers.push({ factor: "Timing", points: seasonalPoints, rationale: seasonality.label });
    }

    // Role scarcity
    const roleMap = { "Chief of Staff": 10, "Security Director": 9, "Yacht Captain": 8, "Private Chef": 7, "Butler": 7, "Estate Manager": 6 };
    const rolePoints = roleMap[formData.positionType] || 5;
    points += rolePoints;
    drivers.push({ factor: "Role Scarcity", points: rolePoints, rationale: formData.positionType });

    const score = Math.min(10, Math.max(1, Math.round(1 + (points / 120) * 9)));
    const label = score <= 3 ? "Straightforward" : score <= 5 ? "Moderate" : score <= 7 ? "Challenging" : score <= 9 ? "Highly Complex" : "Exceptional";
    const confidence = formData.budgetRange === 'not-sure' || !benchmark ? "Medium" : "High";

    return { score, label, points, drivers, confidence, assumptions, redFlags, regionalData, benchmark, seasonality };
  };

  // ============================================
  // AI ANALYSIS WITH RETRY LOGIC
  // ============================================

  // Retry helper with exponential backoff
  const fetchWithRetry = async (url, options, maxRetries = 2) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        // Don't retry client errors (4xx), only server errors (5xx)
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          return response;
        }

        lastError = new Error(`Server error: ${response.status}`);
      } catch (err) {
        lastError = err;
      }

      // Wait before retrying (exponential backoff: 1s, 2s)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  };

  const calculateComplexity = async () => {
    setLoading(true);
    setLoadingStep('Calculating complexity factors...');
    setError(null);

    const det = calculateDeterministicScore();
    const displayTitle = formData.positionType;
    const benchmark = det.benchmark;

    // Get the timeline and budget labels for clearer AI context
    const timelineOption = timelineOptions.find(t => t.value === formData.timeline);
    const budgetOption = budgetRanges.find(b => b.value === formData.budgetRange);

    // Calculate regionally-adjusted salary figures
    const regionalMultiplier = det.regionalData?.multiplier || 1;
    const adjustedBenchmark = benchmark ? {
      p25: Math.round(benchmark.p25 * regionalMultiplier),
      p50: Math.round(benchmark.p50 * regionalMultiplier),
      p75: Math.round(benchmark.p75 * regionalMultiplier)
    } : null;

    try {
      const roleContext = isCorporateRole ? 'family office executive/investment' : 'UHNW household staff';
      const prompt = `You are an expert ${roleContext} recruiter. Analyze this search and return detailed, actionable JSON.
    const ANALYSIS_TIMEOUT = 45000; // 45 seconds timeout

    try {
      const det = calculateDeterministicScore();
      const displayTitle = formData.positionType === 'Other' ? formData.customPositionTitle : formData.positionType;
      const benchmark = det.benchmark;

      setLoadingStep('Analyzing market conditions...');

      const prompt = `You are advising a UHNW principal. Be warm, direct. Use "you/your". Never use "staffing".

Position: ${displayTitle}
Location: ${formData.location}${det.regionalData ? ` (${det.regionalData.label}, ${regionalMultiplier}x cost multiplier)` : ''}
Client Timeline: ${timelineOption?.label || formData.timeline}
Client Budget: ${budgetOption?.label || formData.budgetRange}
Requirements: ${formData.keyRequirements}
Languages: ${formData.languageRequirements.join(', ') || 'None specified'}
Certifications: ${formData.certifications.join(', ') || 'None specified'}
Travel: ${formData.travelRequirement}
Discretion: ${formData.discretionLevel}
${isCorporateRole && formData.aumRange ? `AUM Range: ${formData.aumRange}` : ''}
${isCorporateRole && formData.teamSize ? `Team Size: ${formData.teamSize}` : ''}
${!isCorporateRole && formData.propertiesCount ? `Properties: ${formData.propertiesCount}` : ''}
${!isCorporateRole && formData.householdSize ? `Household Size: ${formData.householdSize}` : ''}

Computed Score: ${det.score}/10 (${det.label})

CRITICAL - Use these REGIONALLY-ADJUSTED salary figures for ${formData.location || 'this market'}:
${adjustedBenchmark ? `- 25th Percentile: $${adjustedBenchmark.p25.toLocaleString()}
- Median (50th): $${adjustedBenchmark.p50.toLocaleString()}
- 75th Percentile: $${adjustedBenchmark.p75.toLocaleString()}` : 'No benchmark available - provide general guidance'}
${benchmark?.scarcity ? `Role Scarcity: ${benchmark.scarcity}/10` : ''}

Your salary recommendation MUST be based on these ADJUSTED figures above, not national averages.
Your timeline MUST align with the "${timelineOption?.label || formData.timeline}" timeframe the client selected.

Be SPECIFIC and ACTIONABLE. Avoid generic advice. Reference the actual role, location, and requirements in your responses.

Return this exact JSON structure:
{
  "salaryRangeGuidance": "Specific salary range with reasoning based on ADJUSTED regional figures. Example: '$X-$Y base, targeting the Nth percentile because [specific reason]'",
  "estimatedTimeline": "Specific timeline with phases. Example: '8-10 weeks: 2 weeks sourcing, 4 weeks interviewing, 2 weeks offer/close'",
  "marketCompetitiveness": "Detailed market assessment mentioning specific dynamics in ${formData.location || 'this market'} for this role",
  "keySuccessFactors": ["Be specific - reference actual requirements", "Mention what will differentiate this opportunity", "Include at least one compensation-related factor"],
  "recommendedAdjustments": ["Specific, actionable changes if budget/timeline/requirements need adjustment"] or [],
  "candidateAvailability": "Abundant|Moderate|Limited|Rare",
  "availabilityReason": "Specific explanation referencing the role requirements and market",
  "sourcingInsight": "Where these candidates typically come from and how to reach them",
  "negotiationLeverage": {
    "candidateAdvantages": ["Specific leverage points candidates have"],
    "employerAdvantages": ["Specific advantages the employer can use"]
  },
  "redFlagAnalysis": "Any concerns about the search parameters, or 'None - well-positioned search'",
  "bottomLine": "3-4 sentence executive summary that's specific to THIS search, not generic advice"
}`;

      const response = await fetchWithRetry("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }, 2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT);

      setLoadingStep('Generating personalized insights...');

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Analysis failed');

      setLoadingStep('Finalizing your analysis...');

      const data = await response.json();
      let text = data.content?.[0]?.text || '';

      // Clean up response - remove any markdown formatting
      text = text.trim()
        .replace(/^```(?:json)?\s*/gi, '')
        .replace(/\s*```$/gi, '')
        .trim();

      // Parse and validate JSON
      const ai = JSON.parse(text);

      // Validate required fields exist
      if (!ai.salaryRangeGuidance || !ai.bottomLine) {
        throw new Error('Incomplete response from AI');
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

      // Fallback to deterministic results with clear indication
      // Use regionally-adjusted figures for fallback too
      const fallbackSalary = adjustedBenchmark
        ? `$${Math.round(adjustedBenchmark.p25/1000)}k - $${Math.round(adjustedBenchmark.p75/1000)}k for ${formData.location || 'this market'}`
        : "Contact us for guidance";
      setResults({ ...det, ...ai, displayTitle, formData: { ...formData } });
    } catch (err) {
      const det = calculateDeterministicScore();
      const isTimeout = err.name === 'AbortError';

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
        bottomLine: "This preliminary analysis is based on our scoring algorithm and market benchmarks. For comprehensive insights including sourcing strategies, compensation structuring, and interview frameworks, schedule a consultation.",
        formData: { ...formData },
        aiAnalysisSuccess: false,
        adjustedBenchmark,
        regionalMultiplier
        availabilityReason: "Based on complexity factors",
        bottomLine: isTimeout
          ? "Analysis timed out, but we've calculated your search complexity. For detailed AI insights, please try again or schedule a consultation."
          : "Detailed AI analysis unavailable. Results based on our proprietary scoring algorithm.",
        formData: { ...formData },
        analysisNote: isTimeout ? 'timeout' : 'fallback'
      });
    }

    setLoading(false);
    setLoadingStep('');
  };

  const runComparison = () => {
    const current = calculateDeterministicScore();
    const currentIdx = budgetRanges.findIndex(b => b.value === formData.budgetRange);

    // Get next budget (higher) if available
    const nextBudget = currentIdx < budgetRanges.length - 2 ? budgetRanges[currentIdx + 1] : null;
    // Get previous budget (lower) if available
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

  const exportToPDF = async () => {
    if (!resultsRef.current) {
      alert('Unable to export PDF. Please try again.');
      return;
    }

    try {
      // Show loading state via React state
      setExportingPDF(true);

      // Get section positions BEFORE capturing
      const containerRect = resultsRef.current.getBoundingClientRect();
      const sections = resultsRef.current.querySelectorAll('[data-pdf-section]');
      const sectionPositions = {};
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        sectionPositions[section.getAttribute('data-pdf-section')] = {
          top: rect.top - containerRect.top,
          bottom: rect.bottom - containerRect.top
        };
      });

      // Small delay to ensure DOM updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the results container as an image
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF - A4 dimensions in mm
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const headerHeight = 25;
      const footerHeight = 15;

      // Calculate dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = 2;
      const contentWidth = pageWidth - (margin * 2);

      // Convert source pixels to mm
      const pxToMm = (px) => (px / scale) * (contentWidth / (imgWidth / scale));

      // Page content heights in mm
      const firstPageContentMm = pageHeight - headerHeight - footerHeight - 5;
      const otherPageContentMm = pageHeight - footerHeight - 10;

      // Find key section positions for forced page breaks
      const metricsTop = sectionPositions['metrics']?.top || 0;
      const metricsTopPx = metricsTop * scale;
      const successFactorsTop = sectionPositions['success-factors']?.top || 0;
      const successFactorsTopPx = successFactorsTop * scale;

      // Build page slices with forced breaks:
      // Page 1: Score, Complexity Breakdown (everything before Metrics)
      // Page 2: Metrics, Sourcing, Benchmarks (everything before Success Factors)
      // Page 3+: Success Factors, Recommendations, Negotiation

      const mmToPx = (mm) => mm * scale * (imgWidth / scale) / contentWidth;
      const otherPageMaxPx = mmToPx(otherPageContentMm);

      const slices = [];

      // Page 1: Everything before Metrics
      if (metricsTopPx > 0) {
        slices.push({ start: 0, end: metricsTopPx });
      }

      // Page 2: Metrics until Success Factors
      if (metricsTopPx < successFactorsTopPx) {
        slices.push({ start: metricsTopPx, end: successFactorsTopPx });
      }

      // Page 3+: Success Factors and everything after
      if (successFactorsTopPx < imgHeight) {
        let currentPos = successFactorsTopPx;
        while (currentPos < imgHeight) {
          const pageEnd = Math.min(currentPos + otherPageMaxPx, imgHeight);
          slices.push({ start: currentPos, end: pageEnd });
          currentPos = pageEnd;
        }
      }

      // Track content end position on each page for CTA placement
      let lastPageContentEndMm = 0;

      // Render each page
      for (let i = 0; i < slices.length; i++) {
        if (i > 0) {
          doc.addPage();
        }

        const slice = slices[i];
        const sliceHeightPx = slice.end - slice.start;

        // Add header only on first page
        if (i === 0) {
          doc.setFillColor(40, 20, 255);
          doc.rect(0, 0, pageWidth, headerHeight, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('TALENT GURUS', pageWidth / 2, 10, { align: 'center' });
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('Search Complexity Analysis', pageWidth / 2, 18, { align: 'center' });
        }

        // Create canvas for this page's portion
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sliceHeightPx;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Check if context was created successfully
        if (!pageCtx) {
          console.error('Failed to create 2D canvas context for PDF page', i);
          throw new Error('Failed to create canvas context for PDF generation');
        }
        
        pageCtx.drawImage(canvas, 0, slice.start, imgWidth, sliceHeightPx, 0, 0, imgWidth, sliceHeightPx);

        // Calculate destination dimensions
        const destHeight = pxToMm(sliceHeightPx);
        const destY = i === 0 ? headerHeight + 2 : 8;

        doc.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, destY, contentWidth, destHeight);

        lastPageContentEndMm = destY + destHeight;
      }

      // Add CTA after all content
      const ctaHeight = 22;
      const ctaMargin = 8;

      // Check if CTA fits on current page
      if (lastPageContentEndMm + ctaHeight + ctaMargin > pageHeight - footerHeight) {
        doc.addPage();
        lastPageContentEndMm = 15;
      }

      const ctaY = lastPageContentEndMm + ctaMargin;
      doc.setFillColor(40, 20, 255);
      doc.roundedRect(margin, ctaY, contentWidth, ctaHeight, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Ready for a comprehensive analysis?', pageWidth / 2, ctaY + 9, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Schedule a consultation: calendly.com/charbel-talentgurus', pageWidth / 2, ctaY + 17, { align: 'center' });

      // Add clickable link
      doc.link(margin, ctaY, contentWidth, ctaHeight, { url: 'https://calendly.com/charbel-talentgurus' });

      // Add footers to all pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text('TALENT GURUS | talent-gurus.com | AI-assisted analysis for informational purposes only.', pageWidth / 2, pageHeight - 6, { align: 'center' });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      }

      // Save
      doc.save(`TG-Analysis-${results.displayTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);

      // Reset loading state
      setExportingPDF(false);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Unable to export PDF. Please try again or contact support.');

      // Reset loading state on error
      setExportingPDF(false);
    try {
      const jsPDF = await loadJsPDF();
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // Helper functions
      const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * (fontSize * 0.5) + 2;
      };

      const addSection = (title) => {
        if (y > 250) { doc.addPage(); y = 20; }
        y += 5;
        doc.setDrawColor(40, 20, 255);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        addText(title, 12, true, [40, 20, 255]);
        y += 3;
      };

      // Header
      doc.setFillColor(40, 20, 255);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('TALENT GURUS', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Search Complexity Analysis', pageWidth / 2, 25, { align: 'center' });
      y = 45;

      // Position and Score Summary
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(results.displayTitle, margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Location: ${results.formData.location} | Generated: ${new Date().toLocaleDateString()}`, margin, y);
      y += 12;

      // Score Circle (simulated)
      const scoreColor = results.score <= 3 ? [27, 94, 32] : results.score <= 5 ? [230, 81, 0] : results.score <= 7 ? [191, 54, 12] : [183, 28, 28];
      doc.setFillColor(...scoreColor);
      doc.circle(pageWidth / 2, y + 15, 20, 'F');
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`${results.score}`, pageWidth / 2, y + 18, { align: 'center' });
      doc.setFontSize(8);
      doc.text('out of 10', pageWidth / 2, y + 25, { align: 'center' });
      y += 45;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${results.label} Search`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Executive Summary
      if (results.bottomLine) {
        addSection('EXECUTIVE SUMMARY');
        addText(results.bottomLine, 10, false, [50, 50, 50]);
      }

      // Key Metrics
      addSection('KEY METRICS');
      addText(`Salary Guidance: ${results.salaryRangeGuidance || 'N/A'}`, 10);
      addText(`Expected Timeline: ${results.estimatedTimeline || 'N/A'}`, 10);
      addText(`Candidate Availability: ${results.candidateAvailability || 'N/A'} - ${results.availabilityReason || ''}`, 10);
      addText(`Market Dynamics: ${results.marketCompetitiveness || 'N/A'}`, 10);

      // Benchmarks
      if (results.benchmark) {
        addSection(`MARKET BENCHMARKS: ${results.displayTitle.toUpperCase()}`);
        addText(`25th Percentile: $${results.benchmark.p25.toLocaleString()}`, 10);
        addText(`Market Median: $${results.benchmark.p50.toLocaleString()}`, 10, true);
        addText(`75th Percentile: $${results.benchmark.p75.toLocaleString()}`, 10);
        y += 5;
        addText('Benefits:', 10, true);
        addText(`Housing: ${results.benchmark.benefits.housing}`, 9);
        addText(`Vehicle: ${results.benchmark.benefits.vehicle}`, 9);
        addText(`Health: ${results.benchmark.benefits.health}`, 9);
        addText(`Bonus: ${results.benchmark.benefits.bonus}`, 9);
      }

      // Complexity Drivers
      addSection(`COMPLEXITY DRIVERS (Total: ${results.points} points)`);
      results.drivers?.forEach(d => {
        addText(`[+${d.points}] ${d.factor}: ${d.rationale}`, 9);
      });

      // Success Factors
      addSection('KEY SUCCESS FACTORS');
      results.keySuccessFactors?.forEach(f => {
        addText(`• ${f}`, 9);
      });

      // Recommendations
      if (results.recommendedAdjustments?.length > 0) {
        addSection('RECOMMENDATIONS');
        results.recommendedAdjustments.forEach(r => {
          addText(`→ ${r}`, 9);
        });
      }

      // Negotiation Dynamics
      if (results.negotiationLeverage) {
        addSection('NEGOTIATION DYNAMICS');
        addText('Candidate Advantages:', 10, true);
        results.negotiationLeverage.candidateAdvantages?.forEach(a => addText(`• ${a}`, 9));
        y += 3;
        addText('Your Advantages:', 10, true);
        results.negotiationLeverage.employerAdvantages?.forEach(a => addText(`• ${a}`, 9));
      }

      // Footer
      if (y > 240) { doc.addPage(); y = 20; }
      y = doc.internal.pageSize.getHeight() - 25;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 20, 255);
      doc.text('TALENT GURUS', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Finding Exceptional Talent for Family Offices | talent-gurus.com', margin, y + 5);
      doc.setFontSize(7);
      doc.text('This analysis provides general market guidance. Every search is unique.', margin, y + 10);

      // Save
      doc.save(`Search-Analysis-${results.displayTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      // Fallback to text export if PDF fails
      console.error('PDF generation failed, falling back to text:', err);
      const content = `
TALENT GURUS - Search Complexity Analysis

Position: ${results.displayTitle}
Location: ${results.formData.location}
Score: ${results.score}/10 - ${results.label}
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${results.bottomLine || 'N/A'}

KEY METRICS
- Salary Guidance: ${results.salaryRangeGuidance || 'N/A'}
- Expected Timeline: ${results.estimatedTimeline || 'N/A'}
- Candidate Availability: ${results.candidateAvailability || 'N/A'} - ${results.availabilityReason || ''}
- Market Dynamics: ${results.marketCompetitiveness || 'N/A'}

${results.benchmark ? `MARKET BENCHMARKS
- 25th Percentile: $${results.benchmark.p25.toLocaleString()}
- Market Median: $${results.benchmark.p50.toLocaleString()}
- 75th Percentile: $${results.benchmark.p75.toLocaleString()}` : ''}

COMPLEXITY DRIVERS (Total: ${results.points} points)
${results.drivers?.map(d => `[+${d.points}] ${d.factor}: ${d.rationale}`).join('\n') || 'N/A'}

KEY SUCCESS FACTORS
${results.keySuccessFactors?.map(f => `- ${f}`).join('\n') || 'N/A'}

${results.recommendedAdjustments?.length > 0 ? `RECOMMENDATIONS\n${results.recommendedAdjustments.map(r => `- ${r}`).join('\n')}` : ''}

TALENT GURUS | talent-gurus.com
This analysis provides general market guidance. Every search is unique.
      `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Search-Analysis-${results.displayTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getComplexityColor = (score) => {
    // Using brand colors: Indigo #2814ff, Pink #de9ea9
    if (score <= 3) return { bg: '#e8e4ff', text: '#2814ff' }; // Light indigo bg, indigo text
    if (score <= 5) return { bg: '#f5e6e9', text: '#2814ff' }; // Light pink bg, indigo text
    if (score <= 7) return { bg: '#de9ea9', text: '#2814ff' }; // Brand pink bg, indigo text
    return { bg: '#c77d8a', text: '#ffffff' }; // Darker pink bg, white text
  };

  const resetForm = () => {
    setResults(null);
    setStep(1);
    setCompareMode(false);
    setComparisonResults(null);
    setWarnings([]);
    setFormData({
      positionType: '', location: '', timeline: '', budgetRange: '', keyRequirements: '',
      email: '', emailConsent: false, discretionLevel: 'standard', propertiesCount: '', householdSize: '',
      priorityCallback: false, phone: '', languageRequirements: [], certifications: [], travelRequirement: 'minimal',
      aumRange: '', teamSize: ''
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="px-6 py-3 rounded-xl" style={{ backgroundColor: '#2814ff' }}>
              <span className="text-white text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>talent gurus</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#2814ff', fontFamily: "'Playfair Display', serif" }}>Search Complexity Calculator</h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">Understanding what you're up against matters. Get a clear picture in 90 seconds.</p>
        </div>

        <div className="bg-slate-50 border-l-4 rounded-lg p-4 mb-8 text-sm text-slate-600" style={{ borderColor: '#2814ff' }}>
          <div className="flex gap-2 mb-2">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2814ff' }} />
            <div>
              <p className="mb-2"><strong>Disclaimer:</strong> This calculator provides general market guidance based on aggregated industry data and should not be construed as a guarantee of search outcomes, candidate availability, or compensation accuracy. Every search is unique, and actual results may vary based on market conditions, candidate preferences, and specific role requirements.</p>
              <p className="text-xs text-slate-500"><strong>AI Disclosure:</strong> Portions of this analysis are generated using AI language models. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. This tool is for informational purposes only and does not constitute professional staffing advice. For personalized guidance, please consult directly with Talent Gurus.</p>
            </div>
          </div>
        </div>

        {!results ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                {['Role & Location', 'Budget & Timeline', 'Requirements', 'Analysis'].map((label, i) => (
                  <span key={i} className={step >= i + 1 ? 'font-semibold text-indigo-600' : ''}>{label}</span>
                ))}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(step / 4) * 100}%`, backgroundColor: '#2814ff' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Tell us about the role</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Position Type *</label>
                    <select name="positionType" value={formData.positionType} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                      <option value="">Select a position ({commonRoles.length} roles available)</option>
                      {/* Family Office - Corporate */}
                      <option disabled className="font-bold bg-slate-100">── FAMILY OFFICE CORPORATE ──</option>
                      {CATEGORY_GROUPS["Family Office - Corporate"].map(category => (
                        <optgroup key={category} label={category.replace('Family Office - ', '')}>
                          {positionsByCategory[category]?.map(pos => (
                            <option key={pos.name} value={pos.name}>{pos.name}</option>
                          ))}
                        </optgroup>
                      ))}
                      {/* Private Service */}
                      <option disabled className="font-bold bg-slate-100">── PRIVATE SERVICE ──</option>
                      {CATEGORY_GROUPS["Private Service"].map(category => (
                        <optgroup key={category} label={category}>
                          {positionsByCategory[category]?.map(pos => (
                            <option key={pos.name} value={pos.name}>{pos.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {formData.positionType && BENCHMARKS[formData.positionType] && (
                      <div className="mt-2 text-xs text-slate-500 space-y-1">
                        <p>Market: ${BENCHMARKS[formData.positionType].p25.toLocaleString()} - ${BENCHMARKS[formData.positionType].p75.toLocaleString()}</p>
                        {BENCHMARKS[formData.positionType].scarcity && (
                          <p>Talent Scarcity: {BENCHMARKS[formData.positionType].scarcity}/10 {BENCHMARKS[formData.positionType].scarcity >= 7 ? '(Hard to find)' : BENCHMARKS[formData.positionType].scarcity >= 5 ? '(Moderate)' : '(Accessible)'}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                        onFocus={() => setShowLocationSuggestions(true)}
                        onBlur={() => setTimeout(() => { setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }, 200)}
                        onKeyDown={handleLocationKeyDown}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="e.g., Palm Beach, Monaco" />
                    </div>
                    {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        {filteredLocationSuggestions.map((loc, idx) => (
                          <button key={idx} type="button"
                            onClick={() => { setFormData({ ...formData, location: loc }); setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }}
                            onMouseEnter={() => setHighlightedLocationIndex(idx)}
                            className={`w-full text-left px-4 py-2 text-sm ${idx === highlightedLocationIndex ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-indigo-50'}`}>
                            {loc} {REGIONAL_ADJUSTMENTS[loc] && <span className="text-slate-500 ml-2">({REGIONAL_ADJUSTMENTS[loc].label})</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Discretion Level</label>
                    <select name="discretionLevel" value={formData.discretionLevel} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                      {discretionLevels.map(d => <option key={d.value} value={d.value}>{d.label} — {d.description}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Budget & Timeline</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timeline *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timelineOptions.map(opt => (
                        <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, timeline: opt.value })}
                          className={`p-4 border-2 rounded-xl text-left transition-all relative ${formData.timeline === opt.value ? 'border-indigo-600 bg-indigo-100 shadow-md ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {formData.timeline === opt.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className={`font-medium text-sm ${formData.timeline === opt.value ? 'text-indigo-900' : 'text-slate-700'}`}>{opt.label}</span>
                            <Clock className={`w-4 h-4 ${formData.timeline === opt.value ? 'text-indigo-600' : 'text-slate-400'}`} />
                          </div>
                          <p className={`text-xs mt-1 ${formData.timeline === opt.value ? 'text-indigo-700' : 'text-slate-500'}`}>{opt.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Budget Range *</label>
                    <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                      <option value="">Select budget range</option>
                      {budgetRanges.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                  </div>

                  {warnings.length > 0 && (
                    <div className="space-y-3">
                      {warnings.map((w, i) => (
                        <div key={i} className={`p-4 rounded-xl flex items-start gap-3 ${w.type === 'critical' ? 'bg-red-50 border border-red-200' : w.type === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${w.type === 'critical' ? 'text-red-600' : w.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                          <div>
                            <p className={`text-sm font-medium ${w.type === 'critical' ? 'text-red-800' : w.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{w.message}</p>
                            {w.suggestion && <p className="text-xs mt-1 text-slate-600">💡 {w.suggestion}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Key Requirements</h3>

                  {/* Certifications - shown first for both corporate and household */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {isCorporateRole ? 'Professional Certifications' : 'Certifications'}
                      {isCorporateRole && <span className="text-xs text-slate-500 ml-2">(Finance/Investment)</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).map(cert => (
                        <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                          className={`px-3 py-1.5 rounded-full text-sm ${formData.certifications.includes(cert) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Languages - different display for corporate vs household */}
                  {isCorporateRole ? (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setShowLanguages(!showLanguages)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div>
                          <span className="text-sm font-medium text-slate-700">Language Requirements</span>
                          <span className="text-xs text-slate-500 ml-2">(Optional - for international operations)</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showLanguages ? 'rotate-180' : ''}`} />
                      </button>
                      {showLanguages && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <div className="flex flex-wrap gap-2">
                            {corporateLanguageShortList.map(lang => (
                              <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                                className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.languageRequirements.length > 0 && !showLanguages && (
                        <p className="text-xs text-indigo-600 mt-2">
                          Selected: {formData.languageRequirements.join(', ')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language Requirements</label>
                      <div className="flex flex-wrap gap-2">
                        {householdLanguageOptions.map(lang => (
                          <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                            className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Travel Requirements</label>
                    <select name="travelRequirement" value={formData.travelRequirement} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                      {travelOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Additional Requirements *</label>
                    <textarea name="keyRequirements" value={formData.keyRequirements} onChange={handleInputChange} rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="Describe specific experience, skills..." />
                    <p className={`text-xs mt-1 ${formData.keyRequirements.length >= 25 ? 'text-green-600' : 'text-slate-500'}`}>
                      {formData.keyRequirements.length} chars {formData.keyRequirements.length < 25 ? `(${25 - formData.keyRequirements.length} more needed)` : '✓'}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Get Your Analysis</h3>

                  <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 flex gap-3">
                    <Zap className="w-6 h-6 flex-shrink-0" style={{ color: '#2814ff' }} />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Your analysis is almost ready</h4>
                      <p className="text-sm text-slate-600">In a few seconds, you'll receive a detailed complexity score, market analysis, and recommendations.</p>
                      <h4 className="font-semibold text-slate-900 mb-1">Your personalized analysis includes:</h4>
                      <ul className="text-sm text-slate-600 space-y-1 mt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-600" />Search complexity score & market positioning</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-600" />Salary benchmarks for your location</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-600" />Candidate availability & timeline estimates</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-600" />Negotiation leverage insights</li>
                      </ul>
                    </div>
                  </div>

                  {/* Conditional fields based on role type */}
                  {isCorporateRole ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Assets Under Management (AUM)</label>
                        <select name="aumRange" value={formData.aumRange} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                          <option value="">Select...</option>
                          <option value="under-100M">Under $100M</option>
                          <option value="100M-300M">$100M - $300M</option>
                          <option value="300M-500M">$300M - $500M</option>
                          <option value="500M-1B">$500M - $1B</option>
                          <option value="1B-plus">$1B+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Team Size (Direct Reports)</label>
                        <select name="teamSize" value={formData.teamSize} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                          <option value="">Select...</option>
                          <option value="0">Individual contributor</option>
                          <option value="1-3">1-3 reports</option>
                          <option value="4-10">4-10 reports</option>
                          <option value="10-plus">10+ reports</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Properties to Staff</label>
                        <select name="propertiesCount" value={formData.propertiesCount} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                          <option value="">Select...</option>
                          <option value="1">1</option>
                          <option value="2-3">2-3</option>
                          <option value="4-6">4-6</option>
                          <option value="7+">7+</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Household Size</label>
                        <select name="householdSize" value={formData.householdSize} onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                          <option value="">Select...</option>
                          <option value="1-2">1-2</option>
                          <option value="3-5">3-5 (family)</option>
                          <option value="6+">6+ (extended)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Lead Capture Section */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Get Your Full Report</h4>
                        <p className="text-sm text-slate-600 mt-1">Receive a detailed PDF analysis you can reference and share with decision-makers.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                        placeholder="your@email.com" />
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Your information stays private. We'll only use it to send your analysis and relevant insights.
                      </p>
                    </div>
                  </div>

                  {/* Priority Callback - More Prominent */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="priorityCallback" checked={formData.priorityCallback} onChange={handleInputChange}
                            className="w-5 h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500" />
                          <span className="font-semibold text-amber-900">Request a Consultation (No Obligation)</span>
                        </label>
                        <p className="text-sm text-amber-800 mt-2">Speak with a specialist within 24 hours. Get strategic advice tailored to your specific search.</p>
                        {formData.priorityCallback && (
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            className="mt-3 w-full px-4 py-3 border-2 border-amber-300 rounded-xl bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            placeholder="Best phone number to reach you" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl flex items-center bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200">Back</button>
                ) : <div />}
                
                <button onClick={step === 4 ? calculateComplexity : nextStep} disabled={loading}
                  className="text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg disabled:opacity-70 transition-all"
                  style={{ backgroundColor: '#2814ff' }}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="animate-pulse">{loadingStep || 'Analyzing...'}</span>
                    </div>
                  ) : step === 4 ? (<><Target className="w-5 h-5" />Get Analysis</>) : (<>Continue<ArrowRight className="w-5 h-5" /></>)}
                </button>
              </div>
            </div>
          </>
        ) : (
          // ============================================
          // RESULTS
          // ============================================
          <div className="space-y-6">
            <div ref={resultsRef} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
              {/* Score */}
              <div className="text-center mb-8">
                <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 shadow-lg"
                  style={{ backgroundColor: getComplexityColor(results.score).bg, borderColor: '#2814ff' }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold leading-tight" style={{ color: getComplexityColor(results.score).text }}>{results.score}</div>
                    <div className="text-xs font-medium mt-1" style={{ color: getComplexityColor(results.score).text }}>out of 10</div>
                  </div>
                </div>
                <div className="inline-block px-5 py-2 rounded-full font-semibold mb-2"
                  style={{ backgroundColor: getComplexityColor(results.score).bg, color: getComplexityColor(results.score).text }}>
                  {results.label} Search
                </div>
                <p className="text-sm text-slate-500">Confidence: {results.confidence}</p>
              </div>

              {results.bottomLine && (
                <div className="bg-slate-50 rounded-xl p-5 mb-6 border-l-4" style={{ borderColor: '#2814ff' }}>
                  <p className="text-slate-800">{results.bottomLine}</p>
                  {results.aiAnalysisSuccess === false && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Results based on market data. AI insights temporarily unavailable.
                    </p>
                  )}
                </div>
              )}

              {/* Drivers */}
              <div data-pdf-section="drivers" className="mb-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: '#2814ff' }}>
                  <Layers className="w-5 h-5" />Complexity Breakdown
                </h4>
                <div className="space-y-2">
                  {results.drivers?.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: '#2814ff' }}>+{d.points}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{d.factor}</div>
                        <div className="text-sm text-slate-600">{d.rationale}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div data-pdf-section="metrics" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-emerald-600" /><h4 className="font-semibold text-sm text-emerald-800">Salary</h4></div>
                  <p className="text-slate-700">{results.salaryRangeGuidance}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-blue-600" /><h4 className="font-semibold text-sm text-blue-800">Timeline</h4></div>
                  <p className="text-slate-700">{results.estimatedTimeline}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-purple-600" /><h4 className="font-semibold text-sm text-purple-800">Market</h4></div>
                  <p className="text-slate-700">{results.marketCompetitiveness}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-amber-600" /><h4 className="font-semibold text-sm text-amber-800">Availability</h4></div>
                  <p className="text-slate-700"><strong>{results.candidateAvailability}</strong> — {results.availabilityReason}</p>
                </div>
              </div>

              {/* Sourcing Insight */}
              {results.sourcingInsight && (
                <div data-pdf-section="sourcing" className="bg-indigo-50 rounded-xl p-5 mb-6 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold text-sm text-indigo-800">Where to Find These Candidates</h4>
                  </div>
                  <p className="text-slate-700">{results.sourcingInsight}</p>
                </div>
              )}

              {/* Benchmarks - Show adjusted figures if available */}
              {results.benchmark && (
                <div data-pdf-section="benchmarks" className="bg-slate-50 rounded-xl p-5 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: '#2814ff' }} />
                    Benchmarks: {results.displayTitle}
                    {results.regionalMultiplier && results.regionalMultiplier !== 1 && (
                      <span className="text-xs font-normal text-slate-500 ml-2">({results.regionalMultiplier}x regional adjustment)</span>
                    )}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${Math.round((results.adjustedBenchmark?.p25 || results.benchmark.p25)/1000)}k
                      </div>
                      <div className="text-xs text-slate-500">25th</div>
                    </div>
                    <div className="bg-white rounded-lg py-2">
                      <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>
                        ${Math.round((results.adjustedBenchmark?.p50 || results.benchmark.p50)/1000)}k
                      </div>
                      <div className="text-xs text-slate-500">Median</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        ${Math.round((results.adjustedBenchmark?.p75 || results.benchmark.p75)/1000)}k
                      </div>
                      <div className="text-xs text-slate-500">75th</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[['Housing', results.benchmark.benefits.housing, Home], ['Vehicle', results.benchmark.benefits.vehicle, Car], ['Health', results.benchmark.benefits.health, Heart], ['Bonus', results.benchmark.benefits.bonus, DollarSign]].map(([label, val, Icon]) => (
                      <div key={label} className="bg-white rounded-lg p-2"><Icon className="w-4 h-4 text-slate-400 mb-1" /><div className="font-medium">{label}</div><div className="text-slate-500">{val}</div></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Factors */}
              <div data-pdf-section="success-factors" className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><CheckCircle className="w-5 h-5" />Success Factors</h4>
                <ul className="space-y-2">
                  {results.keySuccessFactors?.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 bg-green-50 rounded-lg p-3 border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {results.recommendedAdjustments?.length > 0 && (
                <div data-pdf-section="recommendations" className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><Lightbulb className="w-5 h-5" />Recommendations</h4>
                  <ul className="space-y-2">
                    {results.recommendedAdjustments.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <ArrowRight className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.negotiationLeverage && (
                <div data-pdf-section="negotiation" className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><ArrowLeftRight className="w-5 h-5" />Negotiation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <h5 className="font-medium text-red-800 mb-2 text-sm">Candidate Advantages</h5>
                      <ul className="space-y-1">{results.negotiationLeverage.candidateAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <h5 className="font-medium text-green-800 mb-2 text-sm">Your Advantages</h5>
                      <ul className="space-y-1">{results.negotiationLeverage.employerAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button onClick={exportToPDF} disabled={exportingPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {exportingPDF ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export Report
                    </>
                  )}
                </button>
                <button onClick={runComparison} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <RefreshCw className="w-4 h-4" />Compare Scenarios
                </button>
              </div>
            </div>

            {compareMode && comparisonResults && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <div className="flex justify-between mb-4">
                  <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Budget Impact Analysis</h4>
                  <button onClick={() => setCompareMode(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lower budget scenario */}
                  {comparisonResults.withDecrease ? (
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <h5 className="font-medium mb-2 text-red-800 text-sm">If Budget: {comparisonResults.prevLabel}</h5>
                      <div className="text-2xl font-bold text-red-700">{comparisonResults.withDecrease.score}/10</div>
                      <p className="text-xs text-red-600">{comparisonResults.withDecrease.label}</p>
                      {comparisonResults.withDecrease.score > comparisonResults.current.score ? (
                        <p className="text-xs font-medium text-red-800 mt-2">+{comparisonResults.withDecrease.score - comparisonResults.current.score} points harder</p>
                      ) : comparisonResults.withDecrease.score === comparisonResults.current.score && (
                        <p className="text-xs text-red-700 mt-2">Already below market — timeline and location drive score</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                      <h5 className="font-medium mb-2 text-slate-500 text-sm">Lower Budget</h5>
                      <p className="text-xs text-slate-500">Already at minimum range</p>
                    </div>
                  )}

                  {/* Current scenario */}
                  <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-300">
                    <h5 className="font-medium mb-2 text-indigo-800 text-sm">Your Budget (Current)</h5>
                    <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>{comparisonResults.current.score}/10</div>
                    <p className="text-xs text-indigo-600">{comparisonResults.current.label}</p>
                  </div>

                  {/* Higher budget scenario */}
                  {comparisonResults.withIncrease ? (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <h5 className="font-medium mb-2 text-green-800 text-sm">If Budget: {comparisonResults.nextLabel}</h5>
                      <div className="text-2xl font-bold text-green-700">{comparisonResults.withIncrease.score}/10</div>
                      <p className="text-xs text-green-600">{comparisonResults.withIncrease.label}</p>
                      {comparisonResults.current.score > comparisonResults.withIncrease.score ? (
                        <p className="text-xs font-medium text-green-800 mt-2">✓ {comparisonResults.current.score - comparisonResults.withIncrease.score} points easier</p>
                      ) : comparisonResults.current.score === comparisonResults.withIncrease.score ? (
                        <p className="text-xs text-amber-700 mt-2 font-medium">≈ No change — see note below</p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                      <h5 className="font-medium mb-2 text-slate-500 text-sm">Higher Budget</h5>
                      <p className="text-xs text-slate-500">Already at maximum range</p>
                    </div>
                  )}
                </div>
                {comparisonResults.withIncrease && comparisonResults.current.score === comparisonResults.withIncrease.score ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-amber-800">
                      <strong>💡 Why no change?</strong> Your budget is already competitive for this role. At this point, complexity is driven by timeline, location, role scarcity, and specialized requirements — not compensation.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    See how budget changes affect your search complexity score
                  </p>
                )}
              </div>
            )}

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center mb-6">
                <p className="text-indigo-200 text-sm uppercase tracking-wider mb-2">This is your initial analysis</p>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Get the Complete Picture</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Sourcing Strategy</p>
                  <p className="text-indigo-200 text-xs">Exactly where and how to find qualified candidates</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Compensation Deep-Dive</p>
                  <p className="text-indigo-200 text-xs">Benefits, equity, and package structuring</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Interview Framework</p>
                  <p className="text-indigo-200 text-xs">Key questions and evaluation criteria</p>
                </div>
              </div>
              <div className="text-center">
                <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl" style={{ color: '#2814ff' }}>
                  Schedule Your Comprehensive Analysis<ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-indigo-200 text-xs mt-3">30-minute strategy call • No commitment</p>
              </div>
            </div>

            {/* Trust Signals & Methodology */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" style={{ color: '#2814ff' }} />
                About This Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>500+</div>
                  <div className="text-xs text-slate-600">UHNW Placements</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>16</div>
                  <div className="text-xs text-slate-600">Role Categories</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>Feb 2026</div>
                  <div className="text-xs text-slate-600">Data Updated</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Our Methodology:</strong> Salary benchmarks are derived from our proprietary database of completed placements across family offices, private estates, and UHNW households in North America and Europe.</p>
                <p><strong>Complexity Scoring:</strong> Our algorithm weighs 9 key factors including timeline urgency, location tier, language requirements, and market scarcity to provide an accurate difficulty assessment.</p>
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">Analysis combines human expertise with AI-assisted market insights. Results are guidance only—every search is unique. Talent Gurus advisors bring 15+ years of executive household placement experience.</p>
              </div>
            </div>

            <button onClick={resetForm} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-4">← Start New Analysis</button>
          </div>
        )}

        <div className="mt-12 text-center space-y-2">
          <p className="font-semibold" style={{ color: '#2814ff' }}>Talent Gurus - Finding Exceptional Talent for Family Offices</p>
          <p className="text-slate-500">We find the people you'll rely on for years.</p>
          <a href="https://talent-gurus.com" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: '#2814ff' }}>talent-gurus.com</a>
          <p className="text-xs text-slate-400 mt-4">Salary data: {SALARY_DATA_META.lastUpdated} | {commonRoles.length} positions tracked</p>
          <p className="text-xs text-slate-400 mt-4">v{APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchComplexityCalculator;
