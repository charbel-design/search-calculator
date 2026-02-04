import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TrendingUp, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Download, RefreshCw, Users, Car, Heart, Home, ChevronDown, HelpCircle, Zap, MapPin, Phone, X, Scale } from 'lucide-react';

// jsPDF will be loaded via CDN in useEffect

// ============================================
// COMPREHENSIVE BENCHMARKS WITH BENEFITS
// ============================================
const BENCHMARKS = {
  "Chief of Staff": { 
    p25: 220000, p50: 275000, p75: 350000,
    benefits: { housing: "Often included", vehicle: "Company car common", health: "Premium coverage", bonus: "15-25% target" }
  },
  "Estate Manager": { 
    p25: 160000, p50: 200000, p75: 260000,
    benefits: { housing: "On-site housing typical", vehicle: "Estate vehicle provided", health: "Full coverage", bonus: "10-15% target" }
  },
  "Executive Housekeeper": { 
    p25: 110000, p50: 135000, p75: 165000,
    benefits: { housing: "Sometimes included", vehicle: "Rarely", health: "Standard coverage", bonus: "5-10% target" }
  },
  "Personal Assistant": { 
    p25: 90000, p50: 120000, p75: 160000,
    benefits: { housing: "Rarely", vehicle: "Rarely", health: "Standard coverage", bonus: "10-15% target" }
  },
  "Private Chef": { 
    p25: 140000, p50: 185000, p75: 240000,
    benefits: { housing: "Sometimes for live-in", vehicle: "Rarely", health: "Full coverage", bonus: "Holiday bonus typical" }
  },
  "Security Director": { 
    p25: 200000, p50: 250000, p75: 320000,
    benefits: { housing: "On-site often required", vehicle: "Security vehicle provided", health: "Premium coverage", bonus: "15-20% target" }
  },
  "Household Manager": { 
    p25: 130000, p50: 165000, p75: 210000,
    benefits: { housing: "Often included", vehicle: "Sometimes", health: "Full coverage", bonus: "10-15% target" }
  },
  "Family Office Analyst": { 
    p25: 95000, p50: 130000, p75: 175000,
    benefits: { housing: "Rarely", vehicle: "Rarely", health: "Premium coverage", bonus: "20-40% target" }
  },
  "Nanny/Governess": { 
    p25: 85000, p50: 115000, p75: 165000,
    benefits: { housing: "Live-in common", vehicle: "Family vehicle access", health: "Full coverage", bonus: "Holiday bonus + education stipend" }
  },
  "Butler": { 
    p25: 120000, p50: 150000, p75: 200000,
    benefits: { housing: "Live-in typical", vehicle: "Sometimes", health: "Full coverage", bonus: "10-15% target" }
  },
  "Driver/Security Driver": { 
    p25: 75000, p50: 95000, p75: 130000,
    benefits: { housing: "Rarely unless live-in", vehicle: "N/A - work vehicle", health: "Standard coverage", bonus: "5-10% target" }
  },
  "Property Manager": { 
    p25: 100000, p50: 140000, p75: 185000,
    benefits: { housing: "On-site common", vehicle: "Property vehicle", health: "Full coverage", bonus: "10-15% target" }
  },
  "Guest Services Manager": { 
    p25: 95000, p50: 125000, p75: 160000,
    benefits: { housing: "Often included", vehicle: "Sometimes", health: "Full coverage", bonus: "10-15% target" }
  },
  "Chief Stewardess": { 
    p25: 85000, p50: 110000, p75: 145000,
    benefits: { housing: "On-vessel", vehicle: "N/A", health: "Maritime coverage", bonus: "Charter tips + 1-2 months" }
  },
  "Yacht Captain": { 
    p25: 150000, p50: 200000, p75: 280000,
    benefits: { housing: "On-vessel", vehicle: "N/A", health: "Maritime coverage", bonus: "Charter tips + 2-3 months" }
  },
  "Yacht Engineer": { 
    p25: 110000, p50: 145000, p75: 190000,
    benefits: { housing: "On-vessel", vehicle: "N/A", health: "Maritime coverage", bonus: "Charter tips + 1-2 months" }
  }
};

// ============================================
// REGIONAL COST OF LIVING MULTIPLIERS
// ============================================
const REGIONAL_ADJUSTMENTS = {
  "New York City": { multiplier: 1.35, label: "NYC Premium", tier: "ultra-high" },
  "Manhattan": { multiplier: 1.40, label: "Manhattan Premium", tier: "ultra-high" },
  "San Francisco": { multiplier: 1.30, label: "SF Bay Premium", tier: "ultra-high" },
  "Los Angeles": { multiplier: 1.20, label: "LA Premium", tier: "high" },
  "Aspen": { multiplier: 1.25, label: "Resort Premium", tier: "high" },
  "Palm Beach": { multiplier: 1.20, label: "Palm Beach Premium", tier: "high" },
  "The Hamptons": { multiplier: 1.30, label: "Hamptons Premium", tier: "high" },
  "Monaco": { multiplier: 1.45, label: "Monaco Premium", tier: "ultra-high" },
  "London": { multiplier: 1.30, label: "London Premium", tier: "ultra-high" },
  "Miami": { multiplier: 1.10, label: "Miami Premium", tier: "moderate" },
  "Greenwich": { multiplier: 1.25, label: "Greenwich Premium", tier: "high" },
  "Nantucket": { multiplier: 1.20, label: "Island Premium", tier: "high" },
  "Martha's Vineyard": { multiplier: 1.20, label: "Island Premium", tier: "high" },
  "Jackson Hole": { multiplier: 1.20, label: "Resort Premium", tier: "high" },
  "Vail": { multiplier: 1.15, label: "Resort Premium", tier: "high" },
  "Dallas": { multiplier: 1.00, label: "Market Rate", tier: "standard" },
  "Houston": { multiplier: 0.95, label: "Below Coastal Average", tier: "standard" },
  "Chicago": { multiplier: 1.05, label: "Slight Premium", tier: "moderate" },
  "Seattle": { multiplier: 1.15, label: "Pacific NW Premium", tier: "moderate" },
  "Remote/Multiple": { multiplier: 1.10, label: "Flexibility Premium", tier: "variable" }
};

const LOCATION_SUGGESTIONS = [
  "New York City", "Manhattan", "San Francisco", "Los Angeles", "Aspen",
  "Palm Beach", "The Hamptons", "Monaco", "London", "Miami", "Greenwich",
  "Nantucket", "Martha's Vineyard", "Jackson Hole", "Vail", "Dallas",
  "Houston", "Chicago", "Seattle", "Remote/Multiple Locations"
];

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
    customPositionTitle: '',
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
    travelRequirement: 'minimal'
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate (1-2 months)', points: 22, description: 'Rush search - premium sourcing required' },
    { value: 'standard', label: 'Standard (2-3 months)', points: 14, description: 'Typical search timeline' },
    { value: 'flexible', label: 'Flexible (4-6 months)', points: 8, description: 'Time to be selective' },
    { value: 'building-pipeline', label: 'Building Pipeline (6+ months)', points: 3, description: 'Strategic talent mapping' }
  ];

  const budgetRanges = [
    { value: 'under-80k', label: 'Under $80k', midpoint: 70000 },
    { value: '80k-120k', label: '$80k - $120k', midpoint: 100000 },
    { value: '120k-180k', label: '$120k - $180k', midpoint: 150000 },
    { value: '180k-250k', label: '$180k - $250k', midpoint: 215000 },
    { value: '250k-350k', label: '$250k - $350k', midpoint: 300000 },
    { value: 'over-350k', label: 'Over $350k', midpoint: 400000 },
    { value: 'not-sure', label: 'Not Sure / Need Guidance', midpoint: null }
  ];

  const discretionLevels = [
    { value: 'standard', label: 'Standard', points: 0, description: 'Normal confidentiality' },
    { value: 'elevated', label: 'Elevated - NDA Required', points: 5, description: 'Formal NDA, limited disclosure' },
    { value: 'high-profile', label: 'High-Profile Principal', points: 10, description: 'Public figure, media considerations' },
    { value: 'ultra-discrete', label: 'Ultra-Discrete', points: 15, description: 'Maximum confidentiality, blind search' }
  ];

  const languageOptions = ['Mandarin', 'Spanish', 'French', 'Arabic', 'Russian', 'Italian', 'German', 'Japanese', 'Portuguese', 'Korean', 'Hindi'];
  const certificationOptions = ['STCW (Maritime)', 'CPR/First Aid', 'Firearms License', 'Commercial Driver', 'Culinary Degree', 'Security Clearance', 'Child Development', 'Sommelier', 'ServSafe'];
  
  const travelOptions = [
    { value: 'minimal', label: 'Minimal (Local only)', points: 0 },
    { value: 'occasional', label: 'Occasional (1-2 trips/month)', points: 3 },
    { value: 'frequent', label: 'Frequent (Weekly travel)', points: 8 },
    { value: 'heavy-rotation', label: 'Heavy/Rotation (Following principal)', points: 15 }
  ];

  const commonRoles = Object.keys(BENCHMARKS);

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

  const filteredLocationSuggestions = useMemo(() => {
    if (!formData.location) return [];
    return LOCATION_SUGGESTIONS.filter(loc => loc.toLowerCase().includes(formData.location.toLowerCase())).slice(0, 5);
  }, [formData.location]);

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
    if (step === 1 && formData.positionType === 'Other' && !formData.customPositionTitle) {
      setError('Please enter the position title');
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

    if (benchmark && budgetOption?.midpoint) {
      const multiplier = regionalData?.multiplier || 1;
      const adjP25 = benchmark.p25 * multiplier;
      const adjP50 = benchmark.p50 * multiplier;
      const adjP75 = benchmark.p75 * multiplier;

      if (budgetOption.midpoint >= adjP75) budgetPoints = 4;
      else if (budgetOption.midpoint >= adjP50) budgetPoints = 10;
      else if (budgetOption.midpoint >= adjP25) budgetPoints = 18;
      else { budgetPoints = 25; redFlags.push("Budget below market"); }
      
      assumptions.push(`Regional adjustment: ${regionalData?.label || 'Standard'}`);
    }
    points += budgetPoints;
    drivers.push({ factor: "Budget", points: budgetPoints, rationale: budgetPoints <= 10 ? "Competitive" : budgetPoints <= 18 ? "At market" : "Below market" });

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
    setError(null);

    const det = calculateDeterministicScore();
    const displayTitle = formData.positionType === 'Other' ? formData.customPositionTitle : formData.positionType;
    const benchmark = det.benchmark;

    try {
      const prompt = `Analyze this UHNW household search and return JSON only.

Position: ${displayTitle}
Location: ${formData.location}${det.regionalData ? ` (${det.regionalData.label})` : ''}
Timeline: ${formData.timeline}
Budget: ${formData.budgetRange}
Requirements: ${formData.keyRequirements}
Languages: ${formData.languageRequirements.join(', ') || 'None specified'}
Travel: ${formData.travelRequirement}
Discretion: ${formData.discretionLevel}

Computed Score: ${det.score}/10 (${det.label})
Market Benchmark: ${benchmark ? `P25: $${benchmark.p25.toLocaleString()}, P50: $${benchmark.p50.toLocaleString()}, P75: $${benchmark.p75.toLocaleString()}` : 'No benchmark available'}

Return this exact JSON structure:
{
  "salaryRangeGuidance": "specific salary range recommendation",
  "estimatedTimeline": "realistic timeline estimate",
  "marketCompetitiveness": "assessment of market conditions",
  "keySuccessFactors": ["factor 1", "factor 2", "factor 3"],
  "recommendedAdjustments": ["adjustment 1"] or [],
  "candidateAvailability": "Abundant|Moderate|Limited|Rare",
  "availabilityReason": "explanation of availability",
  "negotiationLeverage": { "candidateAdvantages": ["advantage"], "employerAdvantages": ["advantage"] },
  "redFlagAnalysis": "any concerns or none",
  "bottomLine": "2-3 sentence executive summary"
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
        aiAnalysisSuccess: true
      });

    } catch (err) {
      console.error('AI analysis error:', err.message);

      // Fallback to deterministic results with clear indication
      setResults({
        ...det,
        displayTitle,
        salaryRangeGuidance: benchmark
          ? `$${Math.round(benchmark.p25/1000)}k - $${Math.round(benchmark.p75/1000)}k (based on market data)`
          : "Contact us for guidance",
        estimatedTimeline: formData.timeline === 'immediate' ? "6-10 weeks"
          : formData.timeline === 'standard' ? "8-12 weeks"
          : "10-16 weeks",
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
        negotiationLeverage: {
          candidateAdvantages: det.score >= 6
            ? ["Limited candidate pool", "High market demand"]
            : ["Standard market conditions"],
          employerAdvantages: formData.budgetRange?.includes('350') || formData.budgetRange?.includes('250')
            ? ["Competitive compensation", "Attractive opportunity"]
            : ["Growth opportunity"]
        },
        bottomLine: "Analysis based on our scoring algorithm and market benchmarks. For personalized AI insights, please try again or schedule a consultation.",
        formData: { ...formData },
        aiAnalysisSuccess: false
      });
    }

    setLoading(false);
  };

  const runComparison = () => {
    const current = calculateDeterministicScore();
    const currentIdx = budgetRanges.findIndex(b => b.value === formData.budgetRange);
    const nextBudget = currentIdx < budgetRanges.length - 2 ? budgetRanges[currentIdx + 1] : null;
    setComparisonResults({
      current,
      withIncrease: nextBudget ? calculateDeterministicScore(nextBudget.value) : null,
      nextLabel: nextBudget?.label
    });
    setCompareMode(true);
  };

  const exportToPDF = async () => {
    // Create a simple text-based download as a reliable fallback
    const content = `
TALENT GURUS
Search Complexity Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Position: ${results.displayTitle}
Location: ${results.formData.location}
Score: ${results.score}/10 — ${results.label}
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${results.bottomLine || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Salary Guidance:      ${results.salaryRangeGuidance || 'N/A'}
Expected Timeline:    ${results.estimatedTimeline || 'N/A'}
Candidate Availability: ${results.candidateAvailability || 'N/A'} — ${results.availabilityReason || ''}
Market Dynamics:      ${results.marketCompetitiveness || 'N/A'}

${results.benchmark ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARKET BENCHMARKS: ${results.displayTitle.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25th Percentile:  $${results.benchmark.p25.toLocaleString()}
Market Median:    $${results.benchmark.p50.toLocaleString()}
75th Percentile:  $${results.benchmark.p75.toLocaleString()}

Benefits:
• Housing: ${results.benchmark.benefits.housing}
• Vehicle: ${results.benchmark.benefits.vehicle}
• Health: ${results.benchmark.benefits.health}
• Bonus: ${results.benchmark.benefits.bonus}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLEXITY DRIVERS (Total: ${results.points} points)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${results.drivers?.map(d => `[+${d.points}] ${d.factor}: ${d.rationale}`).join('\n') || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY SUCCESS FACTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${results.keySuccessFactors?.map(f => `✓ ${f}`).join('\n') || 'N/A'}

${results.recommendedAdjustments?.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${results.recommendedAdjustments.map(r => `→ ${r}`).join('\n')}
` : ''}

${results.negotiationLeverage ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEGOTIATION DYNAMICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Candidate Advantages:
${results.negotiationLeverage.candidateAdvantages?.map(a => `• ${a}`).join('\n') || '• Standard market position'}

Your Advantages:
${results.negotiationLeverage.employerAdvantages?.map(a => `• ${a}`).join('\n') || '• Standard market position'}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TALENT GURUS
Finding Exceptional Talent for Family Offices
talent-gurus.com

This analysis provides general market guidance. Every search is unique.
    `.trim();

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Search-Analysis-${results.displayTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getComplexityColor = (score) => {
    if (score <= 3) return { bg: '#c8e6c9', text: '#1b5e20' };
    if (score <= 5) return { bg: '#fff3e0', text: '#e65100' };
    if (score <= 7) return { bg: '#ffccbc', text: '#bf360c' };
    return { bg: '#ffcdd2', text: '#b71c1c' };
  };

  const resetForm = () => {
    setResults(null);
    setStep(1);
    setShowCustomTitle(false);
    setCompareMode(false);
    setComparisonResults(null);
    setWarnings([]);
    setFormData({
      positionType: '', customPositionTitle: '', location: '', timeline: '', budgetRange: '', keyRequirements: '',
      email: '', emailConsent: false, discretionLevel: 'standard', propertiesCount: '', householdSize: '',
      priorityCallback: false, phone: '', languageRequirements: [], certifications: [], travelRequirement: 'minimal'
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      
      <div className="max-w-4xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-10 py-5 rounded-xl shadow-lg mb-6" style={{ backgroundColor: '#2814ff' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>TALENT GURUS</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#2814ff', fontFamily: "'Playfair Display', serif" }}>Search Complexity Calculator</h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">Understanding what you're up against matters. Get a clear picture in 90 seconds.</p>
        </div>

        <div className="bg-slate-50 border-l-4 rounded-lg p-4 mb-8 text-sm text-slate-600 flex gap-2" style={{ borderColor: '#2814ff' }}>
          <Info className="w-5 h-5 flex-shrink-0" style={{ color: '#2814ff' }} />
          <p><strong>Important:</strong> This analysis provides general market guidance. Every search is unique.</p>
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
                    <select name="positionType" value={formData.positionType} onChange={(e) => { handleInputChange(e); setShowCustomTitle(e.target.value === 'Other'); }}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                      <option value="">Select a position</option>
                      {commonRoles.map(role => <option key={role} value={role}>{role}</option>)}
                      <option value="Other">Other / Not Listed</option>
                    </select>
                    {formData.positionType && BENCHMARKS[formData.positionType] && (
                      <p className="mt-2 text-xs text-slate-500">💡 Market: ${BENCHMARKS[formData.positionType].p25.toLocaleString()} - ${BENCHMARKS[formData.positionType].p75.toLocaleString()}</p>
                    )}
                  </div>

                  {showCustomTitle && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Position Title *</label>
                      <input type="text" name="customPositionTitle" value={formData.customPositionTitle} onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="e.g., Lifestyle Manager" />
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                        onFocus={() => setShowLocationSuggestions(true)} onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="e.g., Palm Beach, Monaco" />
                    </div>
                    {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        {filteredLocationSuggestions.map((loc, idx) => (
                          <button key={idx} type="button" onClick={() => { setFormData({ ...formData, location: loc }); setShowLocationSuggestions(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm">
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
                          className={`p-4 border-2 rounded-xl text-left transition-all ${formData.timeline === opt.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{opt.label}</span>
                            <Clock className={`w-4 h-4 ${formData.timeline === opt.value ? 'text-indigo-600' : 'text-slate-400'}`} />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Language Requirements</label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map(lang => (
                        <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                          className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {certificationOptions.map(cert => (
                        <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                          className={`px-3 py-1.5 rounded-full text-sm ${formData.certifications.includes(cert) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          {cert}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Travel Requirements</label>
                    <select name="travelRequirement" value={formData.travelRequirement} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl">
                      {travelOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Additional Requirements * (min 25 chars)</label>
                    <textarea name="keyRequirements" value={formData.keyRequirements} onChange={handleInputChange} rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="Describe specific experience, skills..." />
                    <p className="text-xs text-slate-500 mt-1">{formData.keyRequirements.length} / 25</p>
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
                      <h4 className="font-semibold text-slate-900 mb-1">Results appear immediately</h4>
                      <p className="text-sm text-slate-600">Get a detailed complexity score, market analysis, and recommendations.</p>
                    </div>
                  </div>

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

                  <div className="border-t border-slate-200 pt-5">
                    <h4 className="font-medium text-slate-900 mb-3">Optional: Save Results</h4>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl" placeholder="your@email.com" />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="priorityCallback" checked={formData.priorityCallback} onChange={handleInputChange} />
                      <span className="font-medium text-amber-900">Request Priority Callback (24hr)</span>
                    </label>
                    {formData.priorityCallback && (
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                        className="mt-2 w-full px-4 py-2 border border-amber-300 rounded-lg" placeholder="Phone number" />
                    )}
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
                  className="text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg disabled:opacity-70"
                  style={{ backgroundColor: '#2814ff' }}>
                  {loading ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Analyzing...</>) : 
                   step === 4 ? (<><Target className="w-5 h-5" />Get Analysis</>) : (<>Continue<ArrowRight className="w-5 h-5" /></>)}
                </button>
              </div>
            </div>
          </>
        ) : (
          // ============================================
          // RESULTS
          // ============================================
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
              {/* Score */}
              <div className="text-center mb-8">
                <div className="w-36 h-36 rounded-full flex items-center justify-center mx-auto mb-4 border-4 shadow-lg"
                  style={{ backgroundColor: getComplexityColor(results.score).bg, borderColor: '#2814ff' }}>
                  <div className="text-center">
                    <div className="text-5xl font-bold" style={{ color: getComplexityColor(results.score).text }}>{results.score}</div>
                    <div className="text-sm font-medium" style={{ color: getComplexityColor(results.score).text }}>out of 10</div>
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
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: '#2814ff' }}>
                  <Scale className="w-5 h-5" />Complexity Breakdown
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

              {/* Benchmarks */}
              {results.benchmark && (
                <div className="bg-slate-50 rounded-xl p-5 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5" style={{ color: '#2814ff' }} />Benchmarks: {results.displayTitle}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div><div className="text-2xl font-bold text-slate-900">${Math.round(results.benchmark.p25/1000)}k</div><div className="text-xs text-slate-500">25th</div></div>
                    <div className="bg-white rounded-lg py-2"><div className="text-2xl font-bold" style={{ color: '#2814ff' }}>${Math.round(results.benchmark.p50/1000)}k</div><div className="text-xs text-slate-500">Median</div></div>
                    <div><div className="text-2xl font-bold text-slate-900">${Math.round(results.benchmark.p75/1000)}k</div><div className="text-xs text-slate-500">75th</div></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[['Housing', results.benchmark.benefits.housing, Home], ['Vehicle', results.benchmark.benefits.vehicle, Car], ['Health', results.benchmark.benefits.health, Heart], ['Bonus', results.benchmark.benefits.bonus, DollarSign]].map(([label, val, Icon]) => (
                      <div key={label} className="bg-white rounded-lg p-2"><Icon className="w-4 h-4 text-slate-400 mb-1" /><div className="font-medium">{label}</div><div className="text-slate-500">{val}</div></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Factors */}
              <div className="mb-6">
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
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><Target className="w-5 h-5" />Recommendations</h4>
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
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><Scale className="w-5 h-5" />Negotiation</h4>
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
                <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <Download className="w-4 h-4" />Export Report
                </button>
                <button onClick={runComparison} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700">
                  <RefreshCw className="w-4 h-4" />Compare Scenarios
                </button>
              </div>
            </div>

            {compareMode && comparisonResults && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <div className="flex justify-between mb-4">
                  <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Scenario Comparison</h4>
                  <button onClick={() => setCompareMode(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h5 className="font-medium mb-2">Current</h5>
                    <div className="text-3xl font-bold" style={{ color: '#2814ff' }}>{comparisonResults.current.score}/10</div>
                    <p className="text-sm text-slate-600">{comparisonResults.current.label}</p>
                  </div>
                  {comparisonResults.withIncrease && (
                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <h5 className="font-medium mb-2 text-green-800">With Budget: {comparisonResults.nextLabel}</h5>
                      <div className="text-3xl font-bold text-green-700">{comparisonResults.withIncrease.score}/10</div>
                      <p className="text-sm text-green-600">{comparisonResults.withIncrease.label}</p>
                      {comparisonResults.current.score > comparisonResults.withIncrease.score && (
                        <p className="text-xs font-medium text-green-800 mt-2">✓ {comparisonResults.current.score - comparisonResults.withIncrease.score} points easier</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Let's Talk About Your Search</h3>
              <p className="mb-6 text-indigo-100">This analysis gives you the landscape. A conversation gives you a strategy.</p>
              <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl" style={{ color: '#2814ff' }}>
                Schedule a Conversation<ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <button onClick={resetForm} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-4">← Start New Analysis</button>
          </div>
        )}

        <div className="mt-12 text-center space-y-2">
          <p className="font-semibold" style={{ color: '#2814ff' }}>Talent Gurus • Finding Exceptional Talent for Family Offices</p>
          <p className="text-slate-500">We find the people you'll rely on for years.</p>
          <a href="https://talent-gurus.com" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: '#2814ff' }}>talent-gurus.com</a>
        </div>
      </div>
    </div>
  );
};

export default SearchComplexityCalculator;
