import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Download, RefreshCw, Users, Car, Heart, Home, ChevronDown, HelpCircle, Zap, MapPin, Phone, X, Layers, Lightbulb, ArrowLeftRight, Share2, Mail, Copy, SlidersHorizontal, GitCompare, Brain, Lock, GitBranch, Gauge, BarChart3, AlertTriangle } from 'lucide-react';
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

const APP_VERSION = "3.0.0-enhanced";
console.log(`Search Calculator v${APP_VERSION} - With Role Comparison, Shareable Links, What-If Sliders, Email Reports`);

function useDebounce(value, delay = 150) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const REGIONAL_ADJUSTMENTS = REGIONAL_MULTIPLIERS;

const LOCATION_SUGGESTIONS = Object.entries(REGIONAL_MULTIPLIERS)
  .filter(([key]) => !['National_US', 'Midwest_US', 'South_US'].includes(key))
  .map(([key, data]) => data.label || key);

function getSeasonalityFactor() {
  const month = new Date().getMonth();
  if (month >= 9 || month <= 2) {
    return { factor: month >= 9 && month <= 11 ? 1.15 : 1.05, label: month >= 9 && month <= 11 ? 'Q4 Holiday Season' : 'Q1 New Year' };
  }
  if (month >= 3 && month <= 5) {
    return { factor: 0.95, label: 'Q2 Spring - Peak Hiring' };
  }
  return { factor: 1.0, label: 'Q3 Summer' };
}

function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {children}
      </div>
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
          {text}
        </div>
      )}
    </div>
  );
}

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

  // NEW: Role Comparison Mode
  const [showRoleComparison, setShowRoleComparison] = useState(false);
  const [comparisonRoles, setComparisonRoles] = useState([]);

  // NEW: Shareable Results Link
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // NEW: What-If Scenario Sliders
  const [whatIfMode, setWhatIfMode] = useState(false);
  const [whatIfBudget, setWhatIfBudget] = useState('');
  const [whatIfTimeline, setWhatIfTimeline] = useState('');

  // NEW: Email Report
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForReport, setEmailForReport] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (1-2 months)', points: 22, description: 'Rush search - premium sourcing required' },
    { value: 'standard', label: 'Standard (2-3 months)', points: 14, description: 'Typical search timeline' },
    { value: 'flexible', label: 'Flexible (4-6 months)', points: 8, description: 'Time to be selective' },
    { value: 'building-pipeline', label: 'Building Pipeline (6+ months)', points: 3, description: 'Strategic talent mapping' }
  ];

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

  const householdLanguageOptions = ['English (Native/Fluent)', 'Spanish', 'French', 'Mandarin', 'Tagalog', 'Portuguese', 'Russian', 'Italian', 'German', 'Polish', 'Vietnamese', 'Korean', 'Japanese', 'Arabic', 'Hindi', 'Greek', 'Thai', 'Swedish', 'Dutch', 'Hebrew'];
  const corporateLanguageOptions = ['English (Native/Fluent)', 'Mandarin', 'Spanish', 'French', 'German', 'Japanese', 'Arabic', 'Portuguese', 'Korean', 'Russian', 'Italian', 'Hindi', 'Dutch', 'Swedish', 'Hebrew', 'Cantonese', 'Swiss German', 'Luxembourgish', 'Singaporean English', 'Thai'];

  const householdCertificationOptions = ['STCW (Maritime)', 'CPR/First Aid', 'Firearms License', 'LEOSA', 'Commercial Driver (CDL)', 'Culinary Degree', 'Security Clearance', 'Child Development (CDA)', 'Sommelier (CMS)', 'WSET Level 3/4', 'Certified Wine Educator', 'Cicerone (Beer)', 'ServSafe', 'ENG1 Medical', 'PEC (Yacht)', 'RYA Yachtmaster', 'Butler Training (Starkey/IICS)', 'Nursing License (RN/LPN)', 'Montessori Certification', 'Private Pilot License', 'Close Protection (SIA)', 'AED/BLS Certified', 'Estate Management Certification'];
  const corporateCertificationOptions = ['CFA (Chartered Financial Analyst)', 'Series 7 (General Securities)', 'Series 65/66 (Investment Adviser)', 'CPA (Certified Public Accountant)', 'CFP (Certified Financial Planner)', 'CAIA (Alternative Investments)', 'CTFA (Trust & Fiduciary)', 'CIMA (Investment Management)', 'MBA', 'JD (Law Degree)', 'PMP (Project Management)', 'CISSP (Cybersecurity)', 'FRM (Financial Risk Manager)', 'CMA (Management Accounting)', 'EA (Enrolled Agent)', 'CEBS (Employee Benefits)', 'ChFC (Chartered Financial Consultant)', 'CLU (Chartered Life Underwriter)', 'AAMS (Asset Management)', 'CPWA (Private Wealth Advisor)'];

  const corporateLanguageShortList = ['Mandarin', 'Spanish', 'German', 'Japanese', 'Arabic', 'French'];

  const travelOptions = [
    { value: 'minimal', label: 'Minimal (Local only)', points: 0 },
    { value: 'occasional', label: 'Occasional (1-2 trips/month)', points: 3 },
    { value: 'frequent', label: 'Frequent (Weekly travel)', points: 8 },
    { value: 'heavy-rotation', label: 'Heavy/Rotation (Following principal)', points: 15 }
  ];

  const positionsByCategory = useMemo(() => getPositionsByCategory(), []);
  const commonRoles = useMemo(() => getAllPositionNames(), []);

  const isCorporateRole = useMemo(() => {
    if (!formData.positionType) return false;
    const benchmark = getBenchmark(formData.positionType);
    return benchmark?.category?.startsWith('Family Office -');
  }, [formData.positionType]);

  const resultsRef = useRef(null);

  const prevIsCorporateRole = useRef(isCorporateRole);
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

  const budgetRanges = isCorporateRole ? corporateBudgetRanges : householdBudgetRanges;

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
          householdSize: decoded.hs || ''
        }));
        // Auto-advance to results after a short delay
        setTimeout(() => {
          setStep(5); // Special "shared" step that triggers auto-analysis
        }, 100);
      }
    } catch (e) {
      // Invalid share link, ignore
    }
  }, []);

  // Auto-run analysis when loaded from shared link
  useEffect(() => {
    if (step === 5 && formData.positionType) {
      calculateComplexityFromShare();
    }
  }, [step]);

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

  const debouncedLocation = useDebounce(formData.location, 150);

  const filteredLocationSuggestions = useMemo(() => {
    if (!debouncedLocation) return [];
    return LOCATION_SUGGESTIONS.filter(loc => loc.toLowerCase().includes(debouncedLocation.toLowerCase())).slice(0, 5);
  }, [debouncedLocation]);

  useEffect(() => {
    setHighlightedLocationIndex(-1);
  }, [filteredLocationSuggestions]);

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

  const calculateDeterministicScore = (budgetOverride = null, timelineOverride = null) => {
    let points = 0;
    const drivers = [];
    const assumptions = [];
    const redFlags = [];

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
    } else if ((budgetOverride || formData.budgetRange) === 'not-sure') {
      budgetRationale = "Budget TBD - needs guidance";
    }
    points += budgetPoints;
    drivers.push({ factor: "Budget", points: budgetPoints, rationale: budgetRationale });

    // Languages
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
      drivers.push({ factor: "Seasonal Timing", points: seasonalPoints, rationale: seasonality.label });
    }

    // Role scarcity - use benchmark scarcity if available
    const roleScarcity = benchmark?.scarcity || 5;
    const rolePoints = Math.round(roleScarcity);
    points += rolePoints;
    drivers.push({ factor: "Role Scarcity", points: rolePoints, rationale: `${formData.positionType} (${roleScarcity}/10)` });

    // Market demand trend - growing demand = harder search
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

  const fetchWithRetry = async (url, options, maxRetries = 2) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);
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

    const timelineOption = timelineOptions.find(t => t.value === formData.timeline);
    const budgetOption = budgetRanges.find(b => b.value === formData.budgetRange);

    const regionalMultiplier = det.regionalData?.multiplier || 1;
    const adjustedBenchmark = benchmark ? {
      p25: Math.round(benchmark.p25 * regionalMultiplier),
      p50: Math.round(benchmark.p50 * regionalMultiplier),
      p75: Math.round(benchmark.p75 * regionalMultiplier)
    } : null;

    try {
      setLoadingStep('Analyzing market conditions...');

      const roleContext = isCorporateRole ? 'family office executive/investment' : 'UHNW household staff';
      const prompt = `You are an expert ${roleContext} recruiter. Analyze this search and return detailed, actionable JSON.

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
${benchmark?.timeToFill ? `Typical Time to Fill: ${benchmark.timeToFill} weeks` : ''}
${benchmark?.candidatePoolSize ? `Estimated National Candidate Pool: ${benchmark.candidatePoolSize}` : ''}
${benchmark?.turnover ? `Avg Tenure in Role: ${benchmark.turnover.avgTenure} years | Annual Turnover: ${Math.round(benchmark.turnover.annualTurnover * 100)}%` : ''}
${benchmark?.demandTrend ? `Demand Trend: ${benchmark.demandTrend.direction} (${benchmark.demandTrend.yoyChange >= 0 ? '+' : ''}${Math.round(benchmark.demandTrend.yoyChange * 100)}% YoY)` : ''}
${benchmark?.offerAcceptanceRate ? `Offer Acceptance Rate: ${Math.round(benchmark.offerAcceptanceRate * 100)}% (expect ~${(1 / benchmark.offerAcceptanceRate).toFixed(1)} candidates per placement)` : ''}
${benchmark?.counterOfferRate ? `Counter-Offer Rate: ${Math.round(benchmark.counterOfferRate * 100)}% of candidates receive counteroffers from current employers` : ''}
${benchmark?.sourcingChannels ? `Sourcing Mix: Referral ${Math.round(benchmark.sourcingChannels.referral * 100)}% | Agency ${Math.round(benchmark.sourcingChannels.agency * 100)}% | Direct ${Math.round(benchmark.sourcingChannels.direct * 100)}% | Internal ${Math.round(benchmark.sourcingChannels.internal * 100)}%` : ''}
${benchmark?.salaryGrowthRate ? `Salary Growth: ${Math.round(benchmark.salaryGrowthRate * 100)}% YoY — benchmarks may shift ${Math.round(benchmark.salaryGrowthRate * 100 / 2)}% over a 6-month search` : ''}
${benchmark?.typicalExperience ? `Typical Experience: ${benchmark.typicalExperience.min}-${benchmark.typicalExperience.typical} years` : ''}
${benchmark?.retentionRisk ? `First-Year Attrition Rate: ${Math.round(benchmark.retentionRisk.firstYearAttrition * 100)}% — Top departure reasons: ${benchmark.retentionRisk.topReasons.join(', ')}` : ''}
${benchmark?.compensationStructure ? `Comp Structure: Base ${Math.round(benchmark.compensationStructure.basePercent * 100)}% | Bonus ${Math.round(benchmark.compensationStructure.bonusPercent * 100)}% | Benefits ${Math.round(benchmark.compensationStructure.benefitsPercent * 100)}% — Signing bonus offered in ${Math.round(benchmark.compensationStructure.signingBonusFrequency * 100)}% of placements (typical range: $${benchmark.compensationStructure.signingBonusRange})` : ''}
${benchmark?.relocationWillingness !== undefined ? `Relocation Willingness: ${Math.round(benchmark.relocationWillingness * 100)}% of candidates open to relocating — ${benchmark.relocationWillingness < 0.35 ? 'severely limits non-local searches' : benchmark.relocationWillingness < 0.50 ? 'meaningfully constrains non-local searches' : 'reasonable mobility for this role'}` : ''}
${benchmark?.backgroundCheckTimeline ? `Background Check Timeline: ${benchmark.backgroundCheckTimeline} weeks typical vetting period` : ''}

Your salary recommendation MUST be based on these ADJUSTED figures above, not national averages.
Your timeline estimate should use the Time to Fill data as a baseline, adjusted for this specific search's complexity.
Use the offer acceptance rate and counter-offer rate to inform timeline padding and negotiation strategy.
Reference the sourcing channel data in your sourcingInsight — tell the client WHERE successful placements actually come from.
Use salary growth rate to flag whether the client's budget will still be competitive if the search extends.
Use the retention risk data to power your red flag analysis — warn about the specific departure reasons for THIS role, not generic advice.
Use comp structure data to advise on offer packaging — if signing bonuses are common (>40% frequency), recommend one. If bonus percentage is high, flag that base salary alone understates total comp.
Factor relocation willingness into your candidate pool assessment — if only 30% will relocate and this is a non-local search, the effective pool shrinks dramatically.
Add background check timeline to your total timeline estimate — for security-cleared or high-profile roles, this adds weeks that clients often forget.
Your timeline MUST align with the "${timelineOption?.label || formData.timeline}" timeframe the client selected.

Be SPECIFIC and ACTIONABLE. Avoid generic advice. Reference the actual role, location, and requirements in your responses.

CRITICAL GUARDRAILS FOR DECISION INTELLIGENCE:
1. COMPLEXITY SCORE (${det.score}/10): Higher = MORE difficult search. Do NOT suggest "improving" or "reaching a higher" complexity score. A score of 9 means the search is extremely challenging.
2. MANDATE STRENGTH: This is a SEPARATE metric from complexity. Higher mandate strength = STRONGER client position (good). Score reflects budget adequacy, role attractiveness, timeline feasibility, and requirement reasonableness. The teaser should describe what factors strengthen or weaken the mandate, NOT suggest "reaching a higher score."
3. PROBABILITY OF SUCCESS: Must be logically consistent with complexity score and mandate strength. High complexity + weak mandate = lower probability. Low complexity + strong mandate = higher probability.
7. NUMERICAL CONSISTENCY: When you cite a statistic (candidate pool size, attrition rate, counter-offer rate, relocation %, etc.), use the SAME number every time it appears in the report. Do not round down in one section and use the full range in another. Pick one representation and stick with it throughout.
4. TRADE-OFF SCENARIOS: Must use concrete IF/THEN with specific numbers from this search (salary figures, timeline, requirements). Never use generic advice.
5. FALSE SIGNALS: Must be specific to this role and market. Never use generic hiring warnings.
6. ALL teasers must describe WHAT the full analysis contains, not suggest improvements to scores.

Return this exact JSON structure:
{
  "salaryRangeGuidance": "Specific salary range with reasoning based on ADJUSTED regional figures",
  "estimatedTimeline": "Specific timeline with phases",
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
  "bottomLine": "3-4 sentence executive summary that's specific to THIS search, not generic advice",
  "decisionIntelligence": {
    "tradeoffScenarios": {
      "initial": ["IF [condition] THEN [outcome] - high-level trade-off bullet 1", "IF [condition] THEN [outcome] - high-level trade-off bullet 2", "IF [condition] THEN [outcome] - optional third bullet"],
      "completeTeaser": "Full scenario modeling with quantified impact analysis and recommended decision paths"
    },
    "candidatePsychology": {
      "initial": ["Sharp psychological insight about candidate motivations", "What candidates in this role truly prioritize", "Hidden concerns candidates may not voice"],
      "completeTeaser": "Role-specific positioning language and objection-handling frameworks"
    },
    "probabilityOfSuccess": {
      "initialLabel": "Low|Moderate|High",
      "initialConfidence": "X% estimated fill probability within stated timeline",
      "completeTeaser": "Probability delta analysis showing how adjusting budget, timeline, or requirements impacts fill probability"
    },
    "mandateStrength": {
      "initial": {
        "score": "1.0-10.0 composite score (higher = stronger mandate, meaning better-positioned search)",
        "rationale": "One sentence explaining what strengthens or weakens this mandate (budget adequacy, timeline feasibility, requirement reasonableness, role attractiveness)"
      },
      "completeTeaser": "Factor-by-factor breakdown across 12 mandate dimensions with specific action items to strengthen the client's position"
    },
    "falseSignals": {
      "initial": ["Warning about misleading indicator 1", "Warning about misleading indicator 2", "Warning about misleading indicator 3"],
      "completeTeaser": "Screening protocols and verification frameworks for each signal"
    }
  }
}`;

      setLoadingStep('Generating personalized insights...');

      const response = await fetchWithRetry("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }, 2);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed (${response.status})`);
      }

      setLoadingStep('Finalizing your analysis...');

      const data = await response.json();
      let text = data.content?.[0]?.text || '';
      text = text.trim().replace(/^```(?:json)?\s*/gi, '').replace(/\s*```$/gi, '').trim();

      const ai = JSON.parse(text);

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
        bottomLine: "This preliminary analysis is based on our scoring algorithm and market benchmarks. For comprehensive insights including sourcing strategies, compensation structuring, and interview frameworks, schedule a consultation.",
        formData: { ...formData },
        aiAnalysisSuccess: false,
        adjustedBenchmark,
        regionalMultiplier
      });
    }

    setLoading(false);
    setLoadingStep('');
  };

  // Shared link auto-analysis (deterministic only, no AI call)
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
    setStep(1); // Reset step so the results show properly (results != null triggers results view)
  };

  // ============================================
  // BUDGET COMPARISON
  // ============================================
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

  // ============================================
  // NEW: WHAT-IF SCENARIO SCORING
  // ============================================
  const calculateWhatIfScore = useMemo(() => {
    if (!whatIfMode || !results) return null;
    const budgetVal = whatIfBudget || formData.budgetRange;
    const timelineVal = whatIfTimeline || formData.timeline;
    return calculateDeterministicScore(budgetVal, timelineVal);
  }, [whatIfMode, whatIfBudget, whatIfTimeline, results]);

  // ============================================
  // NEW: GENERATE SHAREABLE URL
  // ============================================
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

  // ============================================
  // NEW: EMAIL REPORT
  // ============================================
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
      alert('Unable to send email. Please try again or download the PDF instead.');
    }
    setSendingEmail(false);
  };

  // ============================================
  // PDF EXPORT (html2canvas approach)
  // ============================================
  const exportToPDF = async () => {
    if (!resultsRef.current) {
      alert('Unable to export PDF. Please try again.');
      return;
    }

    try {
      setExportingPDF(true);

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

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const headerHeight = 25;
      const footerHeight = 15;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scale = 2;
      const contentWidth = pageWidth - (margin * 2);

      const pxToMm = (px) => (px / scale) * (contentWidth / (imgWidth / scale));

      const firstPageContentMm = pageHeight - headerHeight - footerHeight - 5;
      const otherPageContentMm = pageHeight - footerHeight - 10;

      const metricsTop = sectionPositions['metrics']?.top || 0;
      const metricsTopPx = metricsTop * scale;
      const successFactorsTop = sectionPositions['success-factors']?.top || 0;
      const successFactorsTopPx = successFactorsTop * scale;

      const mmToPx = (mm) => mm * scale * (imgWidth / scale) / contentWidth;
      const otherPageMaxPx = mmToPx(otherPageContentMm);

      const slices = [];

      if (metricsTopPx > 0) {
        slices.push({ start: 0, end: metricsTopPx });
      }

      if (metricsTopPx < successFactorsTopPx) {
        slices.push({ start: metricsTopPx, end: successFactorsTopPx });
      }

      if (successFactorsTopPx < imgHeight) {
        let currentPos = successFactorsTopPx;
        while (currentPos < imgHeight) {
          const pageEnd = Math.min(currentPos + otherPageMaxPx, imgHeight);
          slices.push({ start: currentPos, end: pageEnd });
          currentPos = pageEnd;
        }
      }

      if (slices.length === 0) {
        slices.push({ start: 0, end: imgHeight });
      }

      let lastPageContentEndMm = 0;

      for (let i = 0; i < slices.length; i++) {
        if (i > 0) doc.addPage();

        const slice = slices[i];
        const sliceHeightPx = slice.end - slice.start;

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

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sliceHeightPx;
        const pageCtx = pageCanvas.getContext('2d');

        if (!pageCtx) {
          throw new Error('Failed to create canvas context for PDF generation');
        }

        pageCtx.drawImage(canvas, 0, slice.start, imgWidth, sliceHeightPx, 0, 0, imgWidth, sliceHeightPx);

        const destHeight = pxToMm(sliceHeightPx);
        const destY = i === 0 ? headerHeight + 2 : 8;

        doc.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, destY, contentWidth, destHeight);
        lastPageContentEndMm = destY + destHeight;
      }

      const ctaHeight = 22;
      const ctaMargin = 8;

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
      doc.link(margin, ctaY, contentWidth, ctaHeight, { url: 'https://calendly.com/charbel-talentgurus' });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text('TALENT GURUS | talent-gurus.com | AI-assisted analysis for informational purposes only.', pageWidth / 2, pageHeight - 6, { align: 'center' });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      }

      doc.save(`TG-Analysis-${results.displayTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
      setExportingPDF(false);
    } catch (err) {
      console.error('PDF export error:', err);
      setExportingPDF(false);

      // Fallback to text export
      try {
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

COMPLEXITY DRIVERS (Total: ${results.points} points)
${results.drivers?.map(d => `[+${d.points}] ${d.factor}: ${d.rationale}`).join('\n') || 'N/A'}

KEY SUCCESS FACTORS
${results.keySuccessFactors?.map(f => `- ${f}`).join('\n') || 'N/A'}

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
      } catch (fallbackErr) {
        alert('Unable to export. Please try again or contact support.');
      }
    }
  };

  // ============================================
  // HELPERS
  // ============================================
  const getComplexityColor = (score) => {
    if (score <= 3) return { bg: '#f5e6e9', text: '#2814ff' };
    if (score <= 5) return { bg: '#ebc7cd', text: '#2814ff' };
    if (score <= 7) return { bg: '#de9ea9', text: '#2814ff' };
    return { bg: '#c77d8a', text: '#ffffff' };
  };

  const resetForm = () => {
    setResults(null);
    setStep(1);
    setCompareMode(false);
    setComparisonResults(null);
    setWarnings([]);
    setWhatIfMode(false);
    setWhatIfBudget('');
    setWhatIfTimeline('');
    setShareUrl('');
    setShowShareModal(false);
    setShowEmailModal(false);
    setShowRoleComparison(false);
    setComparisonRoles([]);
    setFormData({
      positionType: '', location: '', timeline: '', budgetRange: '', keyRequirements: '',
      email: '', emailConsent: false, discretionLevel: 'standard', propertiesCount: '', householdSize: '',
      priorityCallback: false, phone: '', languageRequirements: [], certifications: [], travelRequirement: 'minimal',
      aumRange: '', teamSize: ''
    });
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  // NEW: Toggle role for comparison
  const toggleComparisonRole = (roleName) => {
    setComparisonRoles(prev => {
      if (prev.includes(roleName)) return prev.filter(r => r !== roleName);
      if (prev.length >= 3) return prev;
      return [...prev, roleName];
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 p-4 md:p-8">
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

          {/* NEW: Role Comparison Toggle */}
          {!results && (
            <button
              onClick={() => setShowRoleComparison(!showRoleComparison)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: showRoleComparison ? '#2814ff' : '#d2d4ff', color: showRoleComparison ? '#ffffff' : '#2814ff' }}
            >
              <GitCompare className="w-4 h-4" />
              {showRoleComparison ? 'Back to Calculator' : 'Compare Roles Side-by-Side'}
            </button>
          )}
        </div>

        {/* NEW: ROLE COMPARISON PANEL */}
        {showRoleComparison && !results && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Compare Roles Side-by-Side</h3>
              <span className="text-sm text-slate-500">{comparisonRoles.length}/3 selected</span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select up to 3 roles to compare</label>
              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-1">
                {Object.entries(CATEGORY_GROUPS).map(([groupName, categories]) => (
                  <div key={groupName}>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2 px-2">{groupName}</div>
                    {categories.map(category => (
                      <div key={category}>
                        <div className="text-xs font-semibold text-slate-600 py-1 px-2">{category.replace('Family Office - ', '')}</div>
                        {positionsByCategory[category]?.map(pos => (
                          <button
                            key={pos.name}
                            onClick={() => toggleComparisonRole(pos.name)}
                            disabled={!comparisonRoles.includes(pos.name) && comparisonRoles.length >= 3}
                            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                              comparisonRoles.includes(pos.name)
                                ? 'bg-brand-100 text-brand-600 font-medium'
                                : comparisonRoles.length >= 3
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pos.name}
                            {comparisonRoles.includes(pos.name) && <span className="float-right text-brand-500">✓</span>}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {comparisonRoles.length >= 2 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 pr-4 text-slate-500 font-medium">Metric</th>
                      {comparisonRoles.map(role => (
                        <th key={role} className="text-center py-3 px-2 font-semibold" style={{ color: '#2814ff' }}>{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Salary (25th)</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2">{b ? `$${Math.round(b.p25/1000)}k` : 'N/A'}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100 bg-brand-50/50">
                      <td className="py-3 pr-4 font-medium text-slate-700">Salary (Median)</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2 font-semibold" style={{ color: '#2814ff' }}>{b ? `$${Math.round(b.p50/1000)}k` : 'N/A'}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Salary (75th)</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2">{b ? `$${Math.round(b.p75/1000)}k` : 'N/A'}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Scarcity</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        const s = b?.scarcity || 5;
                        return <td key={role} className="text-center py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${s >= 7 ? 'bg-b-pink-100 text-b-pink-500' : s >= 5 ? 'bg-b-ocre-100 text-b-ocre-500' : 'bg-b-opal-100 text-b-opal-600'}`}>
                            {s}/10
                          </span>
                        </td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Housing</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.housing || 'N/A'}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Vehicle</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.vehicle || 'N/A'}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-medium text-slate-700">Health</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.health || 'N/A'}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">Bonus</td>
                      {comparisonRoles.map(role => {
                        const b = BENCHMARKS[role];
                        return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.bonus || 'N/A'}</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {comparisonRoles.length < 2 && (
              <div className="text-center py-8 text-slate-400">
                <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select at least 2 roles to see the comparison</p>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        {!showRoleComparison && (
          <div className="bg-slate-50 border-l-4 rounded-lg p-4 mb-8 text-sm text-slate-600" style={{ borderColor: '#2814ff' }}>
            <div className="flex gap-2 mb-2">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2814ff' }} />
              <div>
                <p className="mb-2"><strong>Disclaimer:</strong> This calculator provides general market guidance based on aggregated industry data and should not be construed as a guarantee of search outcomes, candidate availability, or compensation accuracy. Every search is unique, and actual results may vary based on market conditions, candidate preferences, and specific role requirements.</p>
                <p className="text-xs text-slate-500"><strong>AI Disclosure:</strong> Portions of this analysis are generated using AI language models. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. This tool is for informational purposes only and does not constitute professional staffing advice. For personalized guidance, please consult directly with Talent Gurus.</p>
              </div>
            </div>
          </div>
        )}

        {!results && !showRoleComparison ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                {['Role & Location', 'Budget & Timeline', 'Requirements', 'Analysis'].map((label, i) => (
                  <span key={i} className={step >= i + 1 ? 'font-semibold text-brand-500' : ''}>{label}</span>
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
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                      <option value="">Select a position ({commonRoles.length} roles available)</option>
                      <option disabled className="font-bold bg-slate-100">── FAMILY OFFICE CORPORATE ──</option>
                      {CATEGORY_GROUPS["Family Office - Corporate"].map(category => (
                        <optgroup key={category} label={category.replace('Family Office - ', '')}>
                          {positionsByCategory[category]?.map(pos => (
                            <option key={pos.name} value={pos.name}>{pos.name}</option>
                          ))}
                        </optgroup>
                      ))}
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
                            className={`w-full text-left px-4 py-2 text-sm ${idx === highlightedLocationIndex ? 'bg-brand-100 text-brand-700' : 'hover:bg-brand-50'}`}>
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
                          className={`p-4 border-2 rounded-xl text-left transition-all relative ${formData.timeline === opt.value ? 'border-brand-500 bg-brand-100 shadow-md ring-2 ring-brand-100' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {formData.timeline === opt.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shadow-md">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className={`font-medium text-sm ${formData.timeline === opt.value ? 'text-brand-700' : 'text-slate-700'}`}>{opt.label}</span>
                            <Clock className={`w-4 h-4 ${formData.timeline === opt.value ? 'text-brand-500' : 'text-slate-400'}`} />
                          </div>
                          <p className={`text-xs mt-1 ${formData.timeline === opt.value ? 'text-brand-500' : 'text-slate-500'}`}>{opt.description}</p>
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
                        <div key={i} className={`p-4 rounded-xl flex items-start gap-3 ${w.type === 'critical' ? 'bg-b-pink-50 border border-b-pink-200' : w.type === 'warning' ? 'bg-b-ocre-50 border border-b-ocre-200' : 'bg-brand-50 border border-brand-100'}`}>
                          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${w.type === 'critical' ? 'text-b-pink-500' : w.type === 'warning' ? 'text-b-ocre-500' : 'text-brand-500'}`} />
                          <div>
                            <p className={`text-sm font-medium ${w.type === 'critical' ? 'text-b-pink-600' : w.type === 'warning' ? 'text-b-ocre-500' : 'text-brand-600'}`}>{w.message}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {isCorporateRole ? 'Professional Certifications' : 'Certifications'}
                      {isCorporateRole && <span className="text-xs text-slate-500 ml-2">(Finance/Investment)</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).map(cert => (
                        <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                          className={`px-3 py-1.5 rounded-full text-sm ${formData.certifications.includes(cert) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isCorporateRole ? (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <button type="button" onClick={() => setShowLanguages(!showLanguages)} className="flex items-center justify-between w-full text-left">
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
                                className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.languageRequirements.length > 0 && !showLanguages && (
                        <p className="text-xs text-brand-500 mt-2">Selected: {formData.languageRequirements.join(', ')}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language Requirements</label>
                      <div className="flex flex-wrap gap-2">
                        {householdLanguageOptions.map(lang => (
                          <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                            className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
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
                    <p className={`text-xs mt-1 ${formData.keyRequirements.length >= 25 ? 'text-b-opal-500' : 'text-slate-500'}`}>
                      {formData.keyRequirements.length} chars {formData.keyRequirements.length < 25 ? `(${25 - formData.keyRequirements.length} more needed)` : '✓'}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Get Your Analysis</h3>

                  <div className="bg-brand-50 rounded-xl p-5 border border-brand-100 flex gap-3">
                    <Zap className="w-6 h-6 flex-shrink-0" style={{ color: '#2814ff' }} />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Your analysis is almost ready</h4>
                      <p className="text-sm text-slate-600">In a few seconds, you'll receive a detailed complexity score, market analysis, and recommendations.</p>
                      <h4 className="font-semibold text-slate-900 mb-1">Your personalized analysis includes:</h4>
                      <ul className="text-sm text-slate-600 space-y-1 mt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-500" />Search complexity score & market positioning</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-500" />Salary benchmarks for your location</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-500" />Candidate availability & timeline estimates</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-500" />Negotiation leverage insights</li>
                      </ul>
                    </div>
                  </div>

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

                  <div className="bg-gradient-to-br from-brand-50 to-b-pink-50 rounded-xl p-5 border border-brand-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Get Your Full Report</h4>
                        <p className="text-sm text-slate-600 mt-1">Receive a detailed PDF analysis you can reference and share with decision-makers.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-brand-100 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
                        placeholder="your@email.com" />
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Your information stays private. We'll only use it to send your analysis and relevant insights.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-b-ocre-50 to-b-ocre-50 border-2 border-b-ocre-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-b-ocre-300 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="priorityCallback" checked={formData.priorityCallback} onChange={handleInputChange}
                            className="w-5 h-5 rounded border-b-ocre-300 text-b-ocre-500 focus:ring-b-ocre-300" />
                          <span className="font-semibold text-b-ocre-600">Request a Consultation (No Obligation)</span>
                        </label>
                        <p className="text-sm text-b-ocre-500 mt-2">Speak with a specialist within 24 hours. Get strategic advice tailored to your specific search.</p>
                        {formData.priorityCallback && (
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            className="mt-3 w-full px-4 py-3 border-2 border-b-ocre-200 rounded-xl bg-white focus:border-b-ocre-300 focus:ring-2 focus:ring-b-ocre-200"
                            placeholder="Best phone number to reach you" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl flex items-center bg-b-pink-50 border border-b-pink-200">
                  <AlertCircle className="w-5 h-5 mr-2 text-b-pink-500" />
                  <p className="text-sm font-medium text-b-pink-600">{error}</p>
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
        ) : results ? (
          // ============================================
          // RESULTS
          // ============================================
          <div className="space-y-6">
            {/* Share/Email Modals */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Share This Analysis</h4>
                    <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Share this link with anyone — they'll see your search parameters and complexity analysis.</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={shareUrl} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 truncate" />
                    <button onClick={copyShareUrl} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                      style={{ backgroundColor: copiedShare ? '#99c1b9' : '#2814ff', color: '#ffffff' }}>
                      {copiedShare ? <><CheckCircle className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">Recipients will see deterministic analysis. No AI insights or personal data is shared.</p>
                </div>
              </div>
            )}

            {showEmailModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Email This Report</h4>
                    <button onClick={() => { setShowEmailModal(false); setEmailSent(false); }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                  </div>
                  {emailSent ? (
                    <div className="text-center py-6">
                      <CheckCircle className="w-12 h-12 text-b-opal-400 mx-auto mb-3" />
                      <p className="font-semibold text-b-opal-600">Report sent!</p>
                      <p className="text-sm text-slate-500 mt-1">Check your inbox for the analysis report.</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 mb-4">We'll send a formatted report with your complete analysis.</p>
                      <input type="email" value={emailForReport} onChange={(e) => setEmailForReport(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        placeholder="your@email.com" />
                      <button onClick={handleSendEmail} disabled={sendingEmail || !emailForReport.includes('@')}
                        className="w-full text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                        style={{ backgroundColor: '#2814ff' }}>
                        {sendingEmail ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" />Sending...</>
                        ) : (
                          <><Mail className="w-4 h-4" />Send Report</>
                        )}
                      </button>
                      <p className="text-xs text-slate-400 mt-2">We'll only use this email to send your report.</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div ref={resultsRef} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
              {/* Shared Result Banner */}
              {results.isSharedResult && (
                <div className="bg-brand-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-brand-100">
                  <Share2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-600">This is a shared analysis</p>
                    <p className="text-xs text-brand-500 mt-1">Results are based on our scoring algorithm. For AI-powered insights, start a new analysis.</p>
                  </div>
                </div>
              )}

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

              {/* NEW: WHAT-IF SCENARIO SLIDERS */}
              <div data-pdf-section="what-if" className="mb-6">
                <button
                  onClick={() => { setWhatIfMode(!whatIfMode); setWhatIfBudget(formData.budgetRange); setWhatIfTimeline(formData.timeline); }}
                  className="flex items-center gap-2 text-sm font-medium mb-3 transition-all"
                  style={{ color: '#2814ff' }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {whatIfMode ? 'Hide What-If Scenarios' : 'Explore What-If Scenarios'}
                </button>

                {whatIfMode && (
                  <div className="bg-gradient-to-br from-brand-50 to-b-pink-50 rounded-xl p-5 border border-brand-100">
                    <p className="text-sm text-slate-600 mb-4">Adjust parameters to see how they affect your complexity score in real-time.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Timeline</label>
                        <select value={whatIfTimeline} onChange={(e) => setWhatIfTimeline(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-100 rounded-lg text-sm bg-white">
                          {timelineOptions.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Budget</label>
                        <select value={whatIfBudget} onChange={(e) => setWhatIfBudget(e.target.value)}
                          className="w-full px-3 py-2 border border-brand-100 rounded-lg text-sm bg-white">
                          {budgetRanges.map(b => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {calculateWhatIfScore && (
                      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-brand-100">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">What-If Score</div>
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold" style={{ color: getComplexityColor(calculateWhatIfScore.score).text === '#ffffff' ? '#2814ff' : getComplexityColor(calculateWhatIfScore.score).text }}>
                              {calculateWhatIfScore.score}
                            </span>
                            <span className="text-sm text-slate-500">/ 10</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                              style={{ backgroundColor: getComplexityColor(calculateWhatIfScore.score).bg, color: getComplexityColor(calculateWhatIfScore.score).text === '#ffffff' ? '#2814ff' : getComplexityColor(calculateWhatIfScore.score).text }}>
                              {calculateWhatIfScore.label}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">vs. Current</div>
                          {calculateWhatIfScore.score !== results.score ? (
                            <span className={`text-sm font-semibold ${calculateWhatIfScore.score < results.score ? 'text-b-opal-500' : 'text-b-pink-500'}`}>
                              {calculateWhatIfScore.score < results.score ? '↓' : '↑'} {Math.abs(calculateWhatIfScore.score - results.score)} point{Math.abs(calculateWhatIfScore.score - results.score) !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">No change</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                <div className="bg-b-opal-50 rounded-xl p-5 border border-b-opal-100">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5 text-b-opal-500" /><h4 className="font-semibold text-sm text-b-opal-600">Salary</h4></div>
                  <p className="text-slate-700">{results.salaryRangeGuidance}</p>
                </div>
                <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
                  <div className="flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-brand-500" /><h4 className="font-semibold text-sm text-brand-600">Timeline</h4></div>
                  <p className="text-slate-700">{results.estimatedTimeline}</p>
                </div>
                <div className="bg-b-pink-50 rounded-xl p-5 border border-b-pink-100">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-b-pink-500" /><h4 className="font-semibold text-sm text-b-pink-600">Market</h4></div>
                  <p className="text-slate-700">{results.marketCompetitiveness}</p>
                </div>
                <div className="bg-b-ocre-50 rounded-xl p-5 border border-b-ocre-100">
                  <div className="flex items-center gap-2 mb-2"><Users className="w-5 h-5 text-b-ocre-500" /><h4 className="font-semibold text-sm text-b-ocre-500">Availability</h4></div>
                  <p className="text-slate-700"><strong>{results.candidateAvailability}</strong> — {results.availabilityReason}</p>
                </div>
              </div>

              {/* Sourcing Insight */}
              {results.sourcingInsight && (
                <div data-pdf-section="sourcing" className="bg-brand-50 rounded-xl p-5 mb-6 border border-brand-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-brand-500" />
                    <h4 className="font-semibold text-sm text-brand-600">Where to Find These Candidates</h4>
                  </div>
                  <p className="text-slate-700">{results.sourcingInsight}</p>
                </div>
              )}

              {/* Benchmarks */}
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
                      <div className="text-2xl font-bold text-slate-900">${Math.round((results.adjustedBenchmark?.p25 || results.benchmark.p25)/1000)}k</div>
                      <div className="text-xs text-slate-500">25th</div>
                    </div>
                    <div className="bg-white rounded-lg py-2">
                      <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>${Math.round((results.adjustedBenchmark?.p50 || results.benchmark.p50)/1000)}k</div>
                      <div className="text-xs text-slate-500">Median</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">${Math.round((results.adjustedBenchmark?.p75 || results.benchmark.p75)/1000)}k</div>
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
                    <li key={i} className="flex items-start gap-3 bg-b-opal-50 rounded-lg p-3 border border-b-opal-100">
                      <CheckCircle className="w-5 h-5 text-b-opal-500 flex-shrink-0 mt-0.5" />
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
                      <li key={i} className="flex items-start gap-3 bg-b-ocre-50 rounded-lg p-3 border border-b-ocre-100">
                        <ArrowRight className="w-5 h-5 text-b-ocre-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flag Analysis */}
              {results.redFlagAnalysis && results.redFlagAnalysis !== "None - well-positioned search" && (
                <div data-pdf-section="red-flags" className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><AlertCircle className="w-5 h-5" />Red Flag Analysis</h4>
                  <div className="bg-b-pink-50 rounded-xl p-4 border border-b-pink-200">
                    <p className="text-slate-700">{results.redFlagAnalysis}</p>
                  </div>
                </div>
              )}

              {/* Market Intelligence */}
              {results.benchmark?.trends && (
                <div data-pdf-section="market-intelligence" className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><TrendingUp className="w-5 h-5" />Market Intelligence</h4>
                  <div className="bg-gradient-to-br from-slate-50 to-brand-50 rounded-xl p-5 border border-slate-200">
                    <p className="text-slate-700 mb-3">{results.benchmark.trends}</p>
                    {results.benchmark.regionalNotes && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-600"><strong>Regional Notes:</strong> {results.benchmark.regionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {results.negotiationLeverage && (
                <div data-pdf-section="negotiation" className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><ArrowLeftRight className="w-5 h-5" />Negotiation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-b-pink-50 rounded-xl p-4 border border-b-pink-100">
                      <h5 className="font-medium text-b-pink-600 mb-2 text-sm">Candidate Advantages</h5>
                      <ul className="space-y-1">{results.negotiationLeverage.candidateAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                    </div>
                    <div className="bg-b-opal-50 rounded-xl p-4 border border-b-opal-100">
                      <h5 className="font-medium text-b-opal-600 mb-2 text-sm">Your Advantages</h5>
                      <ul className="space-y-1">{results.negotiationLeverage.employerAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Decision Intelligence Section */}
              {results.decisionIntelligence && (
                <div data-pdf-section="decision-intelligence" className="mb-6">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: '#2814ff' }}>
                    <Brain className="w-5 h-5" />Decision Intelligence
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">Strategic insights to inform your hiring decisions. Each module provides initial analysis with deeper insights available in your consultation.</p>

                  <div className="space-y-4">
                    {/* Trade-Off Scenarios */}
                    {results.decisionIntelligence.tradeoffScenarios && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d2d4ff' }}>
                            <GitBranch className="w-4 h-4" style={{ color: '#2814ff' }} />
                          </div>
                          <h5 className="font-semibold text-slate-900">Trade-Off Scenarios</h5>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.tradeoffScenarios.initial?.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-brand-500 font-medium">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">{results.decisionIntelligence.tradeoffScenarios.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Candidate Psychology */}
                    {results.decisionIntelligence.candidatePsychology && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf2f4' }}>
                            <Users className="w-4 h-4" style={{ color: '#de9ea9' }} />
                          </div>
                          <h5 className="font-semibold text-slate-900">Candidate Psychology</h5>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.candidatePsychology.initial?.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span style={{ color: '#de9ea9' }} className="font-medium">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">{results.decisionIntelligence.candidatePsychology.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Probability of Success & Mandate Strength - Side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Probability of Success */}
                      {results.decisionIntelligence.probabilityOfSuccess && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d2d4ff' }}>
                              <Gauge className="w-4 h-4" style={{ color: '#2814ff' }} />
                            </div>
                            <h5 className="font-semibold text-slate-900">Success Probability</h5>
                          </div>
                          <div className="mb-4">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'High'
                                ? 'bg-b-opal-100 text-b-opal-600'
                                : results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'Moderate'
                                ? 'bg-b-ocre-100 text-b-ocre-500'
                                : 'bg-b-pink-100 text-b-pink-600'
                            }`}>
                              {results.decisionIntelligence.probabilityOfSuccess.initialLabel}
                            </span>
                          </div>
                          <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500">{results.decisionIntelligence.probabilityOfSuccess.completeTeaser}</span>
                          </div>
                        </div>
                      )}

                      {/* Mandate Strength */}
                      {results.decisionIntelligence.mandateStrength && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fdf2f4' }}>
                              <BarChart3 className="w-4 h-4" style={{ color: '#de9ea9' }} />
                            </div>
                            <h5 className="font-semibold text-slate-900">Mandate Strength</h5>
                          </div>
                          <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold" style={{ color: '#2814ff' }}>
                                {typeof results.decisionIntelligence.mandateStrength.initial?.score === 'number'
                                  ? results.decisionIntelligence.mandateStrength.initial.score.toFixed(1)
                                  : results.decisionIntelligence.mandateStrength.initial?.score || 'N/A'}
                              </span>
                              <span className="text-sm text-slate-500">/ 10</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{results.decisionIntelligence.mandateStrength.initial?.rationale}</p>
                          </div>
                          <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500">{results.decisionIntelligence.mandateStrength.completeTeaser}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* False Signal Warnings */}
                    {results.decisionIntelligence.falseSignals && (
                      <div className="bg-b-ocre-50 border border-b-ocre-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-b-ocre-100">
                            <AlertTriangle className="w-4 h-4 text-b-ocre-500" />
                          </div>
                          <h5 className="font-semibold text-b-ocre-600">False Signal Warnings</h5>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.falseSignals.initial?.map((item, i) => (
                            <li key={i} className="text-sm text-b-ocre-500 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-b-ocre-400 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-b-ocre-200 pt-3 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-b-ocre-400" />
                          <span className="text-xs text-b-ocre-500">{results.decisionIntelligence.falseSignals.completeTeaser}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA to unlock complete analysis */}
                  <div className="mt-4 bg-gradient-to-r from-brand-50 to-b-pink-50 rounded-xl p-4 border border-brand-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" style={{ color: '#2814ff' }} />
                        <span className="text-sm font-medium text-slate-700">Unlock complete decision intelligence analysis</span>
                      </div>
                      <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:shadow-md transition-shadow"
                        style={{ backgroundColor: '#2814ff' }}>
                        Schedule Consultation<ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Enhanced with new features */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => { setEmailForReport(formData.email || ''); setShowEmailModal(true); setEmailSent(false); }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <Mail className="w-4 h-4" />Email Report
                </button>
                <button onClick={generateShareUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <Share2 className="w-4 h-4" />Share Link
                </button>
                <button onClick={runComparison}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <RefreshCw className="w-4 h-4" />Compare Budgets
                </button>
              </div>
            </div>

            {/* Budget Comparison Panel */}
            {compareMode && comparisonResults && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <div className="flex justify-between mb-4">
                  <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Budget Impact Analysis</h4>
                  <button onClick={() => setCompareMode(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisonResults.withDecrease ? (
                    <div className="bg-b-pink-50 rounded-xl p-4 border border-b-pink-200">
                      <h5 className="font-medium mb-2 text-b-pink-600 text-sm">If Budget: {comparisonResults.prevLabel}</h5>
                      <div className="text-2xl font-bold text-b-pink-500">{comparisonResults.withDecrease.score}/10</div>
                      <p className="text-xs text-b-pink-500">{comparisonResults.withDecrease.label}</p>
                      {comparisonResults.withDecrease.score > comparisonResults.current.score ? (
                        <p className="text-xs font-medium text-b-pink-600 mt-2">+{comparisonResults.withDecrease.score - comparisonResults.current.score} points harder</p>
                      ) : comparisonResults.withDecrease.score === comparisonResults.current.score && (
                        <p className="text-xs text-b-pink-500 mt-2">Already below market — timeline and location drive score</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                      <h5 className="font-medium mb-2 text-slate-500 text-sm">Lower Budget</h5>
                      <p className="text-xs text-slate-500">Already at minimum range</p>
                    </div>
                  )}

                  <div className="bg-brand-50 rounded-xl p-4 border-2 border-brand-200">
                    <h5 className="font-medium mb-2 text-brand-600 text-sm">Your Budget (Current)</h5>
                    <div className="text-2xl font-bold" style={{ color: '#2814ff' }}>{comparisonResults.current.score}/10</div>
                    <p className="text-xs text-brand-500">{comparisonResults.current.label}</p>
                  </div>

                  {comparisonResults.withIncrease ? (
                    <div className="bg-b-opal-50 rounded-xl p-4 border border-b-opal-200">
                      <h5 className="font-medium mb-2 text-b-opal-600 text-sm">If Budget: {comparisonResults.nextLabel}</h5>
                      <div className="text-2xl font-bold text-b-opal-600">{comparisonResults.withIncrease.score}/10</div>
                      <p className="text-xs text-b-opal-500">{comparisonResults.withIncrease.label}</p>
                      {comparisonResults.current.score > comparisonResults.withIncrease.score ? (
                        <p className="text-xs font-medium text-b-opal-600 mt-2">✓ {comparisonResults.current.score - comparisonResults.withIncrease.score} points easier</p>
                      ) : comparisonResults.current.score === comparisonResults.withIncrease.score ? (
                        <p className="text-xs text-b-ocre-500 mt-2 font-medium">≈ No change — see note below</p>
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
                  <div className="bg-b-ocre-50 border border-b-ocre-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-b-ocre-500">
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

            {/* CTA */}
            <div className="bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center mb-6">
                <p className="text-brand-100 text-sm uppercase tracking-wider mb-2">This is your initial analysis</p>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Get the Complete Picture</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Sourcing Strategy</p>
                  <p className="text-brand-100 text-xs">Exactly where and how to find qualified candidates</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Compensation Deep-Dive</p>
                  <p className="text-brand-100 text-xs">Benefits, equity, and package structuring</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-semibold mb-1">Interview Framework</p>
                  <p className="text-brand-100 text-xs">Key questions and evaluation criteria</p>
                </div>
              </div>
              <div className="text-center">
                <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl" style={{ color: '#2814ff' }}>
                  Schedule Your Comprehensive Analysis<ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-brand-100 text-xs mt-3">30-minute strategy call • No commitment</p>
              </div>
            </div>

            {/* Methodology */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" style={{ color: '#2814ff' }} />
                About This Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-sm font-semibold text-slate-800 mb-1">{commonRoles.length} Roles Tracked</div>
                  <div className="text-xs text-slate-500">Across family office, household, estate, and maritime positions</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-sm font-semibold text-slate-800 mb-1">Data Updated {SALARY_DATA_META.lastUpdated}</div>
                  <div className="text-xs text-slate-500">Compiled from industry sources, placement data, and market surveys</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Our Methodology:</strong> Salary benchmarks are aggregated from industry databases, completed placements, and compensation surveys across family offices, private estates, and UHNW households.</p>
                <p><strong>Complexity Scoring:</strong> Our algorithm weighs 9 key factors including timeline urgency, location tier, language requirements, and market scarcity to provide an accurate difficulty assessment.</p>
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">Analysis combines market data with AI-assisted insights. Results are guidance only — every search is unique. For personalized advice, schedule a consultation with Talent Gurus.</p>
              </div>
            </div>

            <button onClick={resetForm} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-4">← Start New Analysis</button>
          </div>
        ) : null}

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
