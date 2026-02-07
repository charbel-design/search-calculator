import React, { useState, useEffect } from 'react';
import {
  Share2, Mail, X, AlertCircle, CheckCircle, DollarSign, Clock, TrendingUp, Users, Target, Home, Car, Heart,
  SlidersHorizontal, Layers, Lightbulb, ArrowRight, ArrowLeftRight, Brain, GitBranch, Gauge, BarChart3,
  AlertTriangle, Info, RefreshCw, ArrowLeftCircle, ChevronDown, Compass, MessageCircle, FileText, Shield,
  ClipboardCopy, Loader2, FileEdit, Globe, Lock, Award, Plane, RotateCcw
} from 'lucide-react';
import { sanitizeForPrompt } from './constants';
import { ShareModal, EmailModal } from './Modals';
import { getComplexityColor } from './constants';
import { CustomSelect } from './CustomSelect';
import { SALARY_DATA_META } from '../salaryData';

function ScoreCounter({ target, duration = 1000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export function ResultsView({
  results, formData, loading, compareMode, setCompareMode, comparisonResults,
  whatIfMode, setWhatIfMode, whatIfBudget, setWhatIfBudget, whatIfTimeline,
  setWhatIfTimeline, calculateWhatIfScore, timelineOptions, budgetRanges,
  whatIfBudgetAmount, setWhatIfBudgetAmount, whatIfLanguages, setWhatIfLanguages,
  whatIfTravel, setWhatIfTravel, whatIfDiscretion, setWhatIfDiscretion,
  whatIfCerts, setWhatIfCerts, travelOptions, discretionLevels,
  showShareModal, setShowShareModal, shareUrl, copiedShare, copyShareUrl,
  showEmailModal, setShowEmailModal, emailForReport, setEmailForReport,
  handleSendEmail, sendingEmail, emailSent, setEmailSent, generateShareUrl, runComparison,
  resetForm, showLanguages, setShowLanguages, commonRoles, calculateComplexity
}) {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [methodologyExpanded, setMethodologyExpanded] = useState(false);
  const [deepDiveExpanded, setDeepDiveExpanded] = useState(false);
  const [jdContent, setJdContent] = useState('');
  const [jdLoading, setJdLoading] = useState(false);
  const [jdCopied, setJdCopied] = useState(false);

  // Format JD content: convert **bold** markdown to <strong> HTML, escape other HTML
  const formatJDContent = (text) => {
    if (!text) return '';
    // First escape HTML entities to prevent XSS
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    // Then convert **bold** to <strong>bold</strong>
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return safe;
  };

  // JD Generator — lightweight API call using already-computed results
  const handleGenerateJD = async () => {
    if (jdLoading) return;
    setJdLoading(true);
    setJdContent('');

    const jdPrompt = `Generate a job description for this role based on the search analysis data below. Use ONLY the data provided — do not invent details, statistics, or requirements not present in the analysis.

--- ROLE DATA ---
TITLE: ${results.displayTitle}
LOCATION: ${sanitizeForPrompt(formData?.location || '')}
SALARY RANGE: ${results.salaryRangeGuidance || 'Not specified'}
TIMELINE: ${results.estimatedTimeline || 'Standard'}
MARKET CONTEXT: ${results.marketCompetitiveness || ''}
CANDIDATE AVAILABILITY: ${results.candidateAvailability || 'Moderate'}
DISCRETION LEVEL: ${sanitizeForPrompt(formData?.discretionLevel || 'standard')}

--- CLIENT REQUIREMENTS ---
DESCRIPTION: ${sanitizeForPrompt(formData?.keyRequirements || 'See success factors below')}
LANGUAGES: ${formData?.languageRequirements?.length > 0 ? formData.languageRequirements.join(', ') : 'None specified'}
CERTIFICATIONS: ${formData?.certifications?.length > 0 ? formData.certifications.join(', ') : 'None specified'}
TRAVEL: ${sanitizeForPrompt(formData?.travelRequirement || 'None specified')}
${formData?.aumRange ? `AUM RANGE: ${sanitizeForPrompt(formData.aumRange)}` : ''}
${formData?.teamSize ? `TEAM SIZE: ${sanitizeForPrompt(formData.teamSize)}` : ''}
${formData?.yachtLength ? `YACHT LENGTH: ${sanitizeForPrompt(formData.yachtLength)}` : ''}
${formData?.crewSize ? `CREW SIZE: ${sanitizeForPrompt(formData.crewSize)}` : ''}
${formData?.aircraftType ? `AIRCRAFT TYPE: ${sanitizeForPrompt(formData.aircraftType)}` : ''}
${formData?.fleetSize ? `FLEET SIZE: ${sanitizeForPrompt(formData.fleetSize)}` : ''}
${formData?.propertiesCount && !formData?.yachtLength && !formData?.aircraftType ? `PROPERTIES: ${sanitizeForPrompt(formData.propertiesCount)}` : ''}
${formData?.householdSize && !formData?.yachtLength && !formData?.aircraftType ? `HOUSEHOLD SIZE: ${sanitizeForPrompt(formData.householdSize)}` : ''}

--- ANALYSIS INSIGHTS (use to inform JD, do not copy verbatim) ---
KEY SUCCESS FACTORS: ${(results.keySuccessFactors || []).join('; ')}
WHAT TOP CANDIDATES CARE ABOUT: ${(results.decisionIntelligence?.candidatePsychology?.initial || []).join('; ')}
RED FLAGS TO ADDRESS: ${results.redFlagAnalysis || 'None identified'}
SOURCING INSIGHT: ${results.sourcingInsight || 'N/A'}
${results.benchmark?.benefits ? `BENEFITS CONTEXT: Housing: ${results.benchmark.benefits.housing || 'N/A'}, Vehicle: ${results.benchmark.benefits.vehicle || 'N/A'}, Health: ${results.benchmark.benefits.health || 'N/A'}, Bonus: ${results.benchmark.benefits.bonus || 'N/A'}` : ''}

--- INSTRUCTIONS ---
Write the JD following the system prompt structure exactly. Use the candidate psychology data to write the "WHAT WE OFFER" section — highlight what actually motivates top candidates for THIS specific role, not generic benefits. The "ABOUT THE ROLE" section should sell the opportunity based on what makes it genuinely compelling — use the analysis insights, don't just repeat the title. ALWAYS end with an EEO statement.`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: jdPrompt, type: 'jd' })
      });

      if (!response.ok) throw new Error('Failed to generate');

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      setJdContent(text.trim());
    } catch (err) {
      setJdContent('Unable to generate job description. Please try again.');
    } finally {
      setJdLoading(false);
    }
  };

  const copyJD = () => {
    navigator.clipboard.writeText(jdContent);
    setJdCopied(true);
    setTimeout(() => setJdCopied(false), 2000);
  };

  return (
    <>
      {/* Modals */}
      <ShareModal
        visible={showShareModal}
        shareUrl={shareUrl}
        copiedShare={copiedShare}
        copyShareUrl={copyShareUrl}
        onClose={() => setShowShareModal(false)}
      />
      <EmailModal
        visible={showEmailModal}
        emailForReport={emailForReport}
        setEmailForReport={setEmailForReport}
        handleSendEmail={handleSendEmail}
        sendingEmail={sendingEmail}
        emailSent={emailSent}
        onClose={() => {
          setShowEmailModal(false);
          setEmailSent(false);
        }}
      />

      {/* Results Container */}
      <div className="space-y-6">
        <div className="bg-white rounded-card shadow-card p-6 sm:p-8" aria-live="polite" role="region" aria-label="Analysis results">
          {/* Shared Result Banner */}
          {results.isSharedResult && (
            <div className="bg-blue-50 rounded-card p-4 mb-6 flex items-start gap-3 animate-fadeInUp">
              <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-600">This is a shared analysis</p>
                <p className="text-xs text-blue-500 mt-1">You're viewing benchmark scores and data. Want the full AI-powered breakdown?</p>
                <button
                  onClick={calculateComplexity}
                  className="mt-3 px-4 py-2 rounded-btn text-sm font-medium text-white transition-all hover:opacity-88"
                  style={{ backgroundColor: '#2814ff' }}
                >
                  Run Full AI Analysis
                </button>
              </div>
            </div>
          )}

          {/* Score Section - Always Visible (Top) */}
          <div className="text-center mb-8 animate-fadeInUp py-8 rounded-card" style={{ backgroundColor: 'rgba(40, 20, 255, 0.03)' }}>
            <div className="mb-4">
              <div className="text-5xl font-semibold leading-none" style={{ color: '#2814ff' }}>
                <ScoreCounter target={results.score} />
              </div>
              <div className="text-base text-gray-400 mt-1" style={{ color: '#a1a1a6' }}>/10</div>
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800" style={{ color: '#1d1d1f' }}>
                {results.label} Search
              </p>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-medium" style={{ backgroundColor: 'rgba(40, 20, 255, 0.08)', color: '#2814ff' }}>
              Confidence: {results.confidence}
            </div>
            <div role="img" aria-label={`Search complexity score: ${results.score} out of 10, ${results.label} search`} className="sr-only">
              Score: {results.score}/10
            </div>
          </div>

          {/* Bottom Line */}
          {results.bottomLine && (
            <div className="border-l-2 pl-4 mb-6 animate-fadeInUp delay-200" style={{ borderColor: '#2814ff' }}>
              <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-6">
                <p className="text-sm text-gray-700 leading-relaxed" style={{ color: '#1d1d1f' }}>
                  {results.bottomLine}
                </p>
                {results.aiAnalysisSuccess === false && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Results based on market data. AI insights temporarily unavailable.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Metrics Strip */}
          <div className="flex items-center justify-between mb-8 animate-fadeInUp delay-300 py-4" style={{ borderTop: '1px solid #d2d2d7', borderBottom: '1px solid #d2d2d7' }}>
            <div className="flex-1 text-center">
              <p className="text-xl font-semibold" style={{ color: '#1d1d1f' }}>
                {results.salaryRangeGuidance}
              </p>
              <p className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#a1a1a6' }}>Salary</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#d2d2d7' }} />
            <div className="flex-1 text-center">
              <p className="text-xl font-semibold" style={{ color: '#1d1d1f' }}>
                {results.estimatedTimeline}
              </p>
              <p className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#a1a1a6' }}>Timeline</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: '#d2d2d7' }} />
            <div className="flex-1 text-center">
              <p className="text-xl font-semibold" style={{ color: '#1d1d1f' }}>
                {results.candidateAvailability}
              </p>
              <p className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#a1a1a6' }}>Availability</p>
            </div>
          </div>

          {/* What-If Simulator - Slider-based */}
          <div className="mb-6 animate-fadeInUp delay-400">
            <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card overflow-hidden">
              <button
                onClick={() => setWhatIfMode(!whatIfMode)}
                className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity duration-200"
              >
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4" style={{ color: '#2814ff' }} />
                  <div className="text-left">
                    <h4 className="font-semibold text-sm" style={{ color: '#1d1d1f' }}>What-If Simulator</h4>
                    <p className="text-xs" style={{ color: '#a1a1a6' }}>Slide, toggle, and see the score change in real time</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: '#a1a1a6', transform: whatIfMode ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>

              {whatIfMode && (() => {
                // Compute budget slider bounds from benchmark
                const benchmark = results?.benchmark;
                const regionalMult = results?.regionalMultiplier || 1;
                const currentBudgetOption = budgetRanges.find(b => b.value === formData.budgetRange);
                const currentMidpoint = currentBudgetOption?.midpoint || 0;
                const p25 = benchmark ? Math.round(benchmark.p25 * regionalMult) : 0;
                const p75 = benchmark ? Math.round(benchmark.p75 * regionalMult) : 0;
                const sliderMin = Math.round(Math.min(currentMidpoint, p25) * 0.5);
                const sliderMax = Math.round(Math.max(currentMidpoint, p75) * 1.6);
                const sliderStep = sliderMax > 500000 ? 25000 : sliderMax > 200000 ? 10000 : 5000;
                const budgetSliderValue = whatIfBudgetAmount !== null ? whatIfBudgetAmount : currentMidpoint;

                const formatCurrency = (val) => {
                  if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
                  return `$${Math.round(val / 1000)}k`;
                };

                // Active values for toggles
                const activeLangs = whatIfLanguages !== null ? whatIfLanguages : formData.languageRequirements;
                const activeTravel = whatIfTravel !== null ? whatIfTravel : formData.travelRequirement;
                const activeDiscretion = whatIfDiscretion !== null ? whatIfDiscretion : formData.discretionLevel;
                const activeCerts = whatIfCerts !== null ? whatIfCerts : formData.certifications;
                const activeTimeline = whatIfTimeline || formData.timeline;

                const hasChanges = whatIfBudgetAmount !== null || whatIfLanguages !== null || whatIfTravel !== null ||
                  whatIfDiscretion !== null || whatIfCerts !== null || whatIfTimeline || whatIfBudget;

                const resetWhatIf = () => {
                  setWhatIfBudgetAmount(null);
                  setWhatIfLanguages(null);
                  setWhatIfTravel(null);
                  setWhatIfDiscretion(null);
                  setWhatIfCerts(null);
                  setWhatIfTimeline('');
                  setWhatIfBudget('');
                };

                const delta = calculateWhatIfScore ? calculateWhatIfScore.score - results.score : 0;

                return (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: '#d2d4ff' }}>
                    {/* Live Score Display */}
                    {calculateWhatIfScore && (
                      <div className="mt-4 mb-5 bg-white rounded-btn p-4 border" style={{ borderColor: '#d2d4ff' }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#a1a1a6' }}>Simulated Score</div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-semibold" style={{ color: '#2814ff' }}>
                                  {calculateWhatIfScore.score}
                                </span>
                                <span className="text-sm" style={{ color: '#a1a1a6' }}>/ 10</span>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: '#eeeeff', color: '#2814ff' }}>
                                  {calculateWhatIfScore.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: '#a1a1a6' }}>vs. Current ({results.score})</div>
                            {delta !== 0 ? (
                              <span className="text-lg font-semibold" style={{ color: delta < 0 ? '#5f9488' : '#c77d8a' }}>
                                {delta < 0 ? '↓' : '↑'} {Math.abs(delta)} pt{Math.abs(delta) !== 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-sm" style={{ color: '#a1a1a6' }}>No change</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Budget Slider */}
                    {currentMidpoint > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-3.5 h-3.5" style={{ color: '#c4975e' }} />
                          <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Compensation Budget</span>
                          <span className="text-xs ml-auto font-semibold" style={{ color: '#2814ff' }}>
                            {formatCurrency(budgetSliderValue)}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={sliderMin}
                          max={sliderMax}
                          step={sliderStep}
                          value={budgetSliderValue}
                          onChange={(e) => setWhatIfBudgetAmount(Number(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #2814ff ${((budgetSliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%, #d2d4ff ${((budgetSliderValue - sliderMin) / (sliderMax - sliderMin)) * 100}%)`,
                            WebkitAppearance: 'none'
                          }}
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px]" style={{ color: '#a1a1a6' }}>{formatCurrency(sliderMin)}</span>
                          {benchmark && <span className="text-[10px]" style={{ color: '#a1a1a6' }}>Median: {formatCurrency(Math.round(benchmark.p50 * regionalMult))}</span>}
                          <span className="text-[10px]" style={{ color: '#a1a1a6' }}>{formatCurrency(sliderMax)}</span>
                        </div>
                      </div>
                    )}

                    {/* Timeline Segmented Control */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                        <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Timeline</span>
                      </div>
                      <div className="flex gap-1 p-0.5 rounded-btn" style={{ backgroundColor: '#d2d4ff33' }}>
                        {timelineOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setWhatIfTimeline(opt.value === formData.timeline ? '' : opt.value)}
                            className="flex-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all duration-150"
                            style={{
                              backgroundColor: activeTimeline === opt.value ? '#2814ff' : 'transparent',
                              color: activeTimeline === opt.value ? '#ffffff' : '#6e6e73'
                            }}
                          >
                            {opt.label.split('(')[0].trim()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language Requirement Toggles */}
                    {formData.languageRequirements.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Language Requirements</span>
                          <span className="text-[10px] ml-auto" style={{ color: '#a1a1a6' }}>
                            {activeLangs.length} of {formData.languageRequirements.length} active
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.languageRequirements.map(lang => {
                            const isActive = activeLangs.includes(lang);
                            return (
                              <button
                                key={lang}
                                onClick={() => {
                                  const current = whatIfLanguages !== null ? whatIfLanguages : [...formData.languageRequirements];
                                  if (isActive) {
                                    setWhatIfLanguages(current.filter(l => l !== lang));
                                  } else {
                                    setWhatIfLanguages([...current, lang]);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border"
                                style={{
                                  backgroundColor: isActive ? '#2814ff' : '#ffffff',
                                  color: isActive ? '#ffffff' : '#a1a1a6',
                                  borderColor: isActive ? '#2814ff' : '#d2d2d7',
                                  textDecoration: isActive ? 'none' : 'line-through'
                                }}
                              >
                                {lang}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Travel Requirement */}
                    {travelOptions && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Travel Requirement</span>
                        </div>
                        <div className="flex gap-1 p-0.5 rounded-btn" style={{ backgroundColor: '#d2d4ff33' }}>
                          {travelOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setWhatIfTravel(opt.value === formData.travelRequirement ? null : opt.value)}
                              className="flex-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all duration-150"
                              style={{
                                backgroundColor: activeTravel === opt.value ? '#2814ff' : 'transparent',
                                color: activeTravel === opt.value ? '#ffffff' : '#6e6e73'
                              }}
                            >
                              {opt.label.split('(')[0].trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Discretion Level */}
                    {discretionLevels && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Discretion Level</span>
                        </div>
                        <div className="flex gap-1 p-0.5 rounded-btn" style={{ backgroundColor: '#d2d4ff33' }}>
                          {discretionLevels.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setWhatIfDiscretion(opt.value === formData.discretionLevel ? null : opt.value)}
                              className="flex-1 py-1.5 px-1 rounded-md text-[11px] font-medium transition-all duration-150"
                              style={{
                                backgroundColor: activeDiscretion === opt.value ? '#2814ff' : 'transparent',
                                color: activeDiscretion === opt.value ? '#ffffff' : '#6e6e73'
                              }}
                            >
                              {opt.label.split('-')[0].trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certification Toggles */}
                    {formData.certifications.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs font-medium" style={{ color: '#1d1d1f' }}>Certifications</span>
                          <span className="text-[10px] ml-auto" style={{ color: '#a1a1a6' }}>
                            {activeCerts.length} of {formData.certifications.length} required
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.map(cert => {
                            const isActive = activeCerts.includes(cert);
                            return (
                              <button
                                key={cert}
                                onClick={() => {
                                  const current = whatIfCerts !== null ? whatIfCerts : [...formData.certifications];
                                  if (isActive) {
                                    setWhatIfCerts(current.filter(c => c !== cert));
                                  } else {
                                    setWhatIfCerts([...current, cert]);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border"
                                style={{
                                  backgroundColor: isActive ? '#2814ff' : '#ffffff',
                                  color: isActive ? '#ffffff' : '#a1a1a6',
                                  borderColor: isActive ? '#2814ff' : '#d2d2d7',
                                  textDecoration: isActive ? 'none' : 'line-through'
                                }}
                              >
                                {cert}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Reset Button */}
                    {hasChanges && (
                      <button
                        onClick={resetWhatIf}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-btn transition-opacity hover:opacity-70"
                        style={{ color: '#2814ff' }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to original
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center mb-6 animate-fadeInUp delay-500">
            <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-btn text-sm font-medium text-white hover:opacity-88 transition-all duration-200"
              style={{ backgroundColor: '#2814ff' }}>
              Let's Build Your Strategy<ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Deep Dive Toggle — Progressive Disclosure */}
          <div className="mb-6 animate-fadeInUp delay-600">
            <button
              onClick={() => setDeepDiveExpanded(!deepDiveExpanded)}
              className="w-full p-5 flex flex-col gap-3 rounded-card transition-all duration-200 group"
              style={{
                backgroundColor: '#eeeeff',
                borderLeft: '3px solid #2814ff',
                boxShadow: deepDiveExpanded ? 'none' : '0 1px 8px rgba(40, 20, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2814ff' }}>
                    <Layers className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm" style={{ color: '#1d1d1f' }}>Deep Dive</h4>
                    <p className="text-xs" style={{ color: '#6e6e73' }}>The full picture behind your score</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ color: '#2814ff', transform: deepDiveExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
              </div>
              {!deepDiveExpanded && (
                <div className="flex gap-2 pl-10">
                  {['The Search', 'The Strategy', "What's Next"].map(label => (
                    <span key={label} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: '#ffffff', color: '#2814ff', border: '1px solid #d2d4ff' }}>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </button>
          </div>

          {/* Tabbed Sections — Hidden until Deep Dive expanded */}
          {deepDiveExpanded && (
            <div className="mb-6">
              {/* Apple-style Segmented Control */}
              <div className="flex gap-1 p-1 rounded-btn mb-6" style={{ backgroundColor: '#f5f5f3' }}>
                {[
                  { id: 'breakdown', label: 'The Search' },
                  { id: 'strategy', label: 'The Strategy' },
                  { id: 'next', label: "What's Next" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2 text-sm font-medium rounded-btn transition-all"
                    style={activeTab === tab.id
                      ? { backgroundColor: '#ffffff', color: '#1d1d1f', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                      : { backgroundColor: 'transparent', color: '#6e6e73' }
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              <div className="transition-all duration-300">
                {/* BREAKDOWN TAB */}
                {activeTab === 'breakdown' && (
                  <div className="space-y-6 animate-fadeInUp">
                    {/* Drivers */}
                    <div>
                      <h4 className="font-semibold text-base mb-4" style={{ color: '#2814ff' }}>
                        What Makes This Search Tricky
                      </h4>
                      <div className="space-y-2">
                        {results.drivers?.map((d, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-card" style={{ backgroundColor: '#eeeeff', border: '1px solid #d2d4ff', borderLeft: '3px solid #2814ff' }}>
                            <div className="font-semibold text-sm mt-0.5" style={{ color: '#2814ff' }}>+{d.points}</div>
                            <div className="flex-1">
                              <div className="font-medium" style={{ color: '#1d1d1f' }}>{d.factor}</div>
                              <div className="text-sm" style={{ color: '#6e6e73' }}>{d.rationale}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benchmarks */}
                    {results.benchmark && (
                      <div style={{ backgroundColor: '#fef8f0' }} className="rounded-card p-8">
                        <h4 className="font-semibold mb-6" style={{ color: '#2814ff' }}>
                          Benchmarks: {results.displayTitle}
                          {results.regionalMultiplier && results.regionalMultiplier !== 1 && (
                            <span className="text-xs font-normal ml-2" style={{ color: '#a1a1a6' }}>({results.regionalMultiplier}x regional adjustment)</span>
                          )}
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-center mb-6">
                          <div>
                            <div className="text-2xl font-semibold" style={{ color: '#1d1d1f' }}>${Math.round((results.adjustedBenchmark?.p25 || results.benchmark.p25)/1000)}k</div>
                            <div className="text-xs mt-1" style={{ color: '#a1a1a6' }}>25th</div>
                          </div>
                          <div className="bg-white rounded-btn py-2">
                            <div className="text-2xl font-semibold" style={{ color: '#2814ff' }}>${Math.round((results.adjustedBenchmark?.p50 || results.benchmark.p50)/1000)}k</div>
                            <div className="text-xs mt-1" style={{ color: '#a1a1a6' }}>Median</div>
                          </div>
                          <div>
                            <div className="text-2xl font-semibold" style={{ color: '#1d1d1f' }}>${Math.round((results.adjustedBenchmark?.p75 || results.benchmark.p75)/1000)}k</div>
                            <div className="text-xs mt-1" style={{ color: '#a1a1a6' }}>75th</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {[['Housing', results.benchmark.benefits.housing, Home], ['Vehicle', results.benchmark.benefits.vehicle, Car], ['Health', results.benchmark.benefits.health, Heart], ['Bonus', results.benchmark.benefits.bonus, DollarSign]].map(([label, val, Icon]) => (
                            <div key={label} className="bg-white rounded-btn p-3"><Icon className="w-4 h-4 mb-1" style={{ color: '#ddb87e' }} /><div className="font-medium" style={{ color: '#1d1d1f' }}>{label}</div><div style={{ color: '#a1a1a6' }}>{val}</div></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Market Competitiveness */}
                    <div style={{ backgroundColor: '#f0f7f5' }} className="rounded-card p-6">
                      <h4 className="font-semibold text-sm mb-2" style={{ color: '#72a89d' }}>Market Competitiveness</h4>
                      <p style={{ color: '#1d1d1f' }}>{results.marketCompetitiveness}</p>
                    </div>

                    {/* Market Intelligence */}
                    {results.benchmark?.trends && (
                      <div>
                        <h4 className="font-semibold mb-4" style={{ color: '#2814ff' }}>Market Intelligence</h4>
                        <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-6">
                          <p style={{ color: '#1d1d1f' }} className="mb-3">{results.benchmark.trends}</p>
                          {results.benchmark.regionalNotes && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#d2d2d7' }}>
                              <p className="text-sm" style={{ color: '#6e6e73' }}><strong>Regional Notes:</strong> {results.benchmark.regionalNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* The Numbers Behind the Search */}
                    {results.benchmark && (
                      <div className="space-y-6">
                        <h4 className="font-semibold" style={{ color: '#2814ff' }}>The Numbers Behind the Search</h4>

                        {(results.benchmark.offerAcceptanceRate !== undefined || results.benchmark.counterOfferRate !== undefined) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.benchmark.offerAcceptanceRate !== undefined && (
                              <div style={{ backgroundColor: '#fef8f0' }} className="rounded-card p-6 text-center">
                                <p className="text-xs mb-3 uppercase tracking-widest font-medium" style={{ color: '#a1a1a6' }}>Offer Acceptance Rate</p>
                                <p className="text-4xl font-semibold mb-2" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.offerAcceptanceRate * 100)}%
                                </p>
                                <p className="text-xs" style={{ color: '#a1a1a6' }}>~{Math.round(results.benchmark.offerAcceptanceRate * 10)} candidates per placement</p>
                              </div>
                            )}
                            {results.benchmark.counterOfferRate !== undefined && (
                              <div style={{ backgroundColor: '#fdf2f4' }} className="rounded-card p-6 text-center">
                                <p className="text-xs mb-3 uppercase tracking-widest font-medium" style={{ color: '#a1a1a6' }}>Counter-Offer Rate</p>
                                <p className="text-4xl font-semibold mb-2" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.counterOfferRate * 100)}%
                                </p>
                                <p className="text-xs" style={{ color: '#a1a1a6' }}>Risk of candidate retention</p>
                              </div>
                            )}
                          </div>
                        )}

                        {results.benchmark.sourcingChannels && (
                          <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-6">
                            <p className="text-xs mb-4 uppercase tracking-widest font-medium" style={{ color: '#a1a1a6' }}>Sourcing Channel Mix</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {results.benchmark.sourcingChannels.referral !== undefined && (
                                <div className="text-center">
                                  <p className="text-2xl font-semibold mb-1" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.sourcingChannels.referral * 100)}%</p>
                                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Referral</p>
                                </div>
                              )}
                              {results.benchmark.sourcingChannels.agency !== undefined && (
                                <div className="text-center">
                                  <p className="text-2xl font-semibold mb-1" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.sourcingChannels.agency * 100)}%</p>
                                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Search Firm</p>
                                </div>
                              )}
                              {results.benchmark.sourcingChannels.direct !== undefined && (
                                <div className="text-center">
                                  <p className="text-2xl font-semibold mb-1" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.sourcingChannels.direct * 100)}%</p>
                                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Direct</p>
                                </div>
                              )}
                              {results.benchmark.sourcingChannels.internal !== undefined && (
                                <div className="text-center">
                                  <p className="text-2xl font-semibold mb-1" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.sourcingChannels.internal * 100)}%</p>
                                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Internal</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {(results.benchmark.salaryGrowthRate !== undefined || results.benchmark.typicalExperience !== undefined) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.benchmark.salaryGrowthRate !== undefined && (
                              <div style={{ backgroundColor: '#fef8f0' }} className="rounded-card p-4 text-center">
                                <p className="text-xs mb-2 uppercase tracking-widest font-medium" style={{ color: '#a1a1a6' }}>Salary Growth YoY</p>
                                <p className="text-3xl font-semibold" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.salaryGrowthRate * 100)}%</p>
                              </div>
                            )}
                            {results.benchmark.typicalExperience && (
                              <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-4 text-center">
                                <p className="text-xs mb-2 uppercase tracking-widest font-medium" style={{ color: '#a1a1a6' }}>Typical Experience</p>
                                <p className="text-3xl font-semibold" style={{ color: '#2814ff' }}>{results.benchmark.typicalExperience.typical}y</p>
                                {results.benchmark.typicalExperience.min && (
                                  <p className="text-xs mt-1" style={{ color: '#a1a1a6' }}>{results.benchmark.typicalExperience.min}+ years min</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {(results.benchmark.retentionRisk !== undefined || results.benchmark.compensationStructure !== undefined || results.benchmark.relocationWillingness !== undefined) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(results.benchmark.retentionRisk !== undefined || results.benchmark.relocationWillingness !== undefined) && (
                              <div style={{ backgroundColor: '#fdf2f4' }} className="rounded-card p-6">
                                <p className="text-xs mb-4 uppercase tracking-widest font-medium" style={{ color: '#c77d8a' }}>Retention & Relocation</p>
                                <div className="space-y-4">
                                  {results.benchmark.retentionRisk?.firstYearAttrition !== undefined && (
                                    <div>
                                      <p className="text-sm mb-1" style={{ color: '#6e6e73' }}>First-Year Attrition</p>
                                      <p className="text-2xl font-semibold" style={{ color: '#c77d8a' }}>{Math.round(results.benchmark.retentionRisk.firstYearAttrition * 100)}%</p>
                                    </div>
                                  )}
                                  {results.benchmark.relocationWillingness !== undefined && (
                                    <div>
                                      <p className="text-sm mb-1" style={{ color: '#6e6e73' }}>Relocation Willingness</p>
                                      <p className="text-2xl font-semibold" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.relocationWillingness * 100)}%</p>
                                    </div>
                                  )}
                                  {results.benchmark.retentionRisk?.topReasons && results.benchmark.retentionRisk.topReasons.length > 0 && (
                                    <div className="pt-3 border-t" style={{ borderColor: '#d2d2d7' }}>
                                      <p className="text-xs font-medium mb-2" style={{ color: '#a1a1a6' }}>Top Departure Risks</p>
                                      <div className="flex flex-wrap gap-2">
                                        {results.benchmark.retentionRisk.topReasons.map((reason, i) => (
                                          <span key={i} className="inline-block px-2 py-1 rounded-full text-[11px]" style={{ backgroundColor: '#fdf2f4', color: '#c77d8a' }}>{reason}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {results.benchmark.compensationStructure && (
                              <div style={{ backgroundColor: '#fef8f0' }} className="rounded-card p-6">
                                <p className="text-xs mb-4 uppercase tracking-widest font-medium" style={{ color: '#ddb87e' }}>Compensation Structure</p>
                                <div className="space-y-4">
                                  {(results.benchmark.compensationStructure.basePercent !== undefined || results.benchmark.compensationStructure.bonusPercent !== undefined || results.benchmark.compensationStructure.benefitsPercent !== undefined) && (
                                    <div>
                                      <p className="text-sm mb-3" style={{ color: '#6e6e73' }}>Typical Split</p>
                                      <div className="space-y-2">
                                        {results.benchmark.compensationStructure.basePercent !== undefined && (
                                          <div>
                                            <div className="flex justify-between text-xs mb-1" style={{ color: '#6e6e73' }}><span>Base Salary</span><span className="font-medium">{Math.round(results.benchmark.compensationStructure.basePercent * 100)}%</span></div>
                                            <div className="h-2 bg-white rounded-full overflow-hidden"><div className="h-full" style={{ backgroundColor: '#2814ff', width: `${Math.round(results.benchmark.compensationStructure.basePercent * 100)}%` }} /></div>
                                          </div>
                                        )}
                                        {results.benchmark.compensationStructure.bonusPercent !== undefined && (
                                          <div>
                                            <div className="flex justify-between text-xs mb-1" style={{ color: '#6e6e73' }}><span>Bonus</span><span className="font-medium">{Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%</span></div>
                                            <div className="h-2 bg-white rounded-full overflow-hidden"><div className="h-full" style={{ backgroundColor: '#9ca3af', width: `${Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%` }} /></div>
                                          </div>
                                        )}
                                        {results.benchmark.compensationStructure.benefitsPercent !== undefined && (
                                          <div>
                                            <div className="flex justify-between text-xs mb-1" style={{ color: '#6e6e73' }}><span>Benefits</span><span className="font-medium">{Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%</span></div>
                                            <div className="h-2 bg-white rounded-full overflow-hidden"><div className="h-full" style={{ backgroundColor: '#cbd5e1', width: `${Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%` }} /></div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {(results.benchmark.compensationStructure.signingBonusFrequency !== undefined || results.benchmark.compensationStructure.signingBonusRange) && (
                                    <div className="pt-3 border-t" style={{ borderColor: '#d2d2d7' }}>
                                      <p className="text-sm mb-2" style={{ color: '#6e6e73' }}>Signing Bonus</p>
                                      <div className="space-y-1">
                                        {results.benchmark.compensationStructure.signingBonusFrequency !== undefined && (
                                          <p className="text-sm font-medium" style={{ color: '#2814ff' }}>{Math.round(results.benchmark.compensationStructure.signingBonusFrequency * 100)}% offer signing bonus</p>
                                        )}
                                        {results.benchmark.compensationStructure.signingBonusRange && (
                                          <p className="text-xs" style={{ color: '#a1a1a6' }}>{results.benchmark.compensationStructure.signingBonusRange}</p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* THE STRATEGY TAB */}
                {activeTab === 'strategy' && (
                  <div className="space-y-6 animate-fadeInUp">
                    {/* Probability & Mandate Strength Grid */}
                    {results.decisionIntelligence && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.decisionIntelligence.probabilityOfSuccess && (
                          <div className="bg-white rounded-card p-5 border" style={{ borderColor: '#d2d2d7' }}>
                            <h5 className="font-semibold mb-3" style={{ color: '#2814ff' }}>Success Probability</h5>
                            <div className="mb-3">
                              <div className="flex items-baseline gap-2">
                                {(() => {
                                  const conf = results.decisionIntelligence.probabilityOfSuccess.initialConfidence || '';
                                  const pctMatch = conf.match(/(\d+)%/);
                                  const pct = pctMatch ? pctMatch[1] : null;
                                  return pct ? (
                                    <>
                                      <span className="text-3xl font-semibold" style={{ color: '#2814ff' }}>{pct}%</span>
                                      <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#eeeeff', color: '#6e6e73' }}>
                                        {results.decisionIntelligence.probabilityOfSuccess.initialLabel}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-3xl font-semibold" style={{ color: '#2814ff' }}>{results.decisionIntelligence.probabilityOfSuccess.initialLabel}</span>
                                  );
                                })()}
                              </div>
                              {(() => {
                                const conf = results.decisionIntelligence.probabilityOfSuccess.initialConfidence || '';
                                const rest = conf.replace(/^\d+%\s*/, '');
                                return rest ? <p className="text-sm mt-1" style={{ color: '#6e6e73' }}>{rest}</p> : null;
                              })()}
                            </div>
                            <div className="border-t pt-3 flex items-center gap-2" style={{ borderColor: '#d2d2d7' }}>
                              <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                              <span className="text-xs" style={{ color: '#a1a1a6' }}>{results.decisionIntelligence.probabilityOfSuccess.completeTeaser}</span>
                            </div>
                          </div>
                        )}

                        {results.decisionIntelligence.mandateStrength && (
                          <div className="bg-white rounded-card p-5 border" style={{ borderColor: '#d2d2d7' }}>
                            <h5 className="font-semibold mb-3" style={{ color: '#2814ff' }}>How Strong Is This Brief?</h5>
                            <div className="mb-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-semibold" style={{ color: '#2814ff' }}>
                                  {typeof results.decisionIntelligence.mandateStrength.initial?.score === 'number'
                                    ? results.decisionIntelligence.mandateStrength.initial.score.toFixed(1)
                                    : results.decisionIntelligence.mandateStrength.initial?.score || 'N/A'}
                                </span>
                                <span className="text-sm" style={{ color: '#a1a1a6' }}>/ 10</span>
                              </div>
                              <p className="text-sm mt-1" style={{ color: '#6e6e73' }}>{results.decisionIntelligence.mandateStrength.initial?.rationale}</p>
                            </div>
                            <div className="border-t pt-3 flex items-center gap-2" style={{ borderColor: '#d2d2d7' }}>
                              <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                              <span className="text-xs" style={{ color: '#a1a1a6' }}>{results.decisionIntelligence.mandateStrength.completeTeaser}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Trade-Off Scenarios */}
                    {results.decisionIntelligence?.tradeoffScenarios && (
                      <div className="bg-white rounded-card p-5 border" style={{ borderColor: '#d2d2d7' }}>
                        <h5 className="font-semibold mb-3" style={{ color: '#2814ff' }}>Trade-Off Scenarios</h5>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.tradeoffScenarios.initial?.map((item, i) => (
                            <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#1d1d1f' }}>
                              <span className="font-medium" style={{ color: '#2814ff' }}>→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-3 flex items-center gap-2" style={{ borderColor: '#d2d2d7' }}>
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs" style={{ color: '#a1a1a6' }}>{results.decisionIntelligence.tradeoffScenarios.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Candidate Psychology */}
                    {results.decisionIntelligence?.candidatePsychology && (
                      <div className="bg-white rounded-card p-5 border" style={{ borderColor: '#d2d2d7' }}>
                        <h5 className="font-semibold mb-3" style={{ color: '#2814ff' }}>What Top Candidates Care About</h5>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.candidatePsychology.initial?.map((item, i) => (
                            <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#1d1d1f' }}>
                              <span style={{ color: '#2814ff' }} className="font-medium">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-3 flex items-center gap-2" style={{ borderColor: '#d2d2d7' }}>
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs" style={{ color: '#a1a1a6' }}>{results.decisionIntelligence.candidatePsychology.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Success Factors */}
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: '#2814ff' }}>Success Factors</h4>
                      <ul className="space-y-2">
                        {results.keySuccessFactors?.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 p-3 rounded-card" style={{ backgroundColor: '#f0f7f5' }}>
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#72a89d' }} />
                            <span style={{ color: '#1d1d1f' }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    {results.recommendedAdjustments?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: '#2814ff' }}>Recommendations</h4>
                        <ul className="space-y-2">
                          {results.recommendedAdjustments.map((r, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-card" style={{ backgroundColor: '#fef8f0' }}>
                              <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ddb87e' }} />
                              <span style={{ color: '#1d1d1f' }}>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sourcing Insight */}
                    {results.sourcingInsight && (
                      <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-6">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: '#1d1d1f' }}>Where to Find These Candidates</h4>
                        <p style={{ color: '#1d1d1f' }}>{results.sourcingInsight}</p>
                      </div>
                    )}

                    {/* Negotiation Dynamics */}
                    {results.negotiationLeverage && (
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: '#1d1d1f' }}>Negotiation Dynamics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-4">
                            <h5 className="font-medium mb-2 text-sm" style={{ color: '#1d1d1f' }}>Candidate Advantages</h5>
                            <ul className="space-y-1">{results.negotiationLeverage.candidateAdvantages?.map((a, i) => <li key={i} className="text-sm" style={{ color: '#6e6e73' }}>• {a}</li>)}</ul>
                          </div>
                          <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-4">
                            <h5 className="font-medium mb-2 text-sm" style={{ color: '#1d1d1f' }}>Your Advantages</h5>
                            <ul className="space-y-1">{results.negotiationLeverage.employerAdvantages?.map((a, i) => <li key={i} className="text-sm" style={{ color: '#6e6e73' }}>• {a}</li>)}</ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Watch Out For — Red Flags + False Signals combined */}
                    {(results.redFlagAnalysis || results.decisionIntelligence?.falseSignals) && (
                      <div>
                        <h4 className="font-semibold mb-3" style={{ color: '#1d1d1f' }}>Watch Out For</h4>
                        {results.redFlagAnalysis && results.redFlagAnalysis !== "None - well-positioned search" && (
                          <div className="rounded-card p-4 mb-3" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d', color: '#92400e' }}>
                            <p>{results.redFlagAnalysis}</p>
                          </div>
                        )}
                        {results.decisionIntelligence?.falseSignals && (
                          <div className="rounded-card p-5" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}>
                            <h5 className="font-semibold mb-3" style={{ color: '#92400e' }}>Don't Be Fooled By</h5>
                            <ul className="space-y-2 mb-4">
                              {results.decisionIntelligence.falseSignals.initial?.map((item, i) => (
                                <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#92400e' }}>
                                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="border-t pt-3 flex items-center gap-2" style={{ borderColor: '#fcd34d' }}>
                              <ArrowRight className="w-3.5 h-3.5" />
                              <span className="text-xs">{results.decisionIntelligence.falseSignals.completeTeaser}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* WHAT'S NEXT TAB */}
                {activeTab === 'next' && (
                  <div className="space-y-6 animate-fadeInUp">
                    <p className="text-sm" style={{ color: '#6e6e73' }}>
                      {results.whatsNext?.intro || "You've got the data. Here's how we turn it into a successful placement."}
                    </p>

                    {/* Process Steps */}
                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          icon: MessageCircle,
                          title: 'Discovery Call',
                          duration: '30 min',
                          description: results.whatsNext?.discoveryCall || 'We walk through your analysis together, dig into the nuances that data alone can\'t capture, and align on what "the right person" actually looks like for your household or office.',
                        },
                        {
                          step: 2,
                          icon: Compass,
                          title: 'Sourcing Strategy',
                          duration: 'Week 1',
                          description: results.whatsNext?.sourcingStrategy || 'Based on your role complexity, location, and budget, we build a sourcing plan — which networks to tap, how to position the opportunity, and what the outreach looks like.',
                        },
                        {
                          step: 3,
                          icon: Users,
                          title: 'Curated Shortlist',
                          duration: 'Weeks 2–4',
                          description: results.whatsNext?.shortlist || 'You receive a vetted shortlist of candidates who match the brief. Each profile includes social due diligence, reference notes, and our honest assessment.',
                        },
                        {
                          step: 4,
                          icon: Shield,
                          title: 'Interview & Placement Support',
                          duration: 'Through close',
                          description: results.whatsNext?.placementSupport || 'We coordinate interviews, handle reference checks, support offer negotiation, and stay involved through the first 90 days to make sure the placement sticks.',
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#2814ff' }}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            {idx < 3 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: '#d2d2d7' }} />}
                          </div>
                          <div className="pb-4 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold" style={{ color: '#1d1d1f' }}>{item.title}</h5>
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#eeeeff', color: '#6e6e73' }}>{item.duration}</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#6e6e73' }}>{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* What you get */}
                    <div style={{ backgroundColor: '#eeeeff' }} className="rounded-card p-6">
                      <h5 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#1d1d1f' }}>
                        <FileText className="w-4 h-4" style={{ color: '#2814ff' }} />
                        What the full engagement includes
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          'Candidate fit & motivation assessment',
                          'Compensation negotiation playbook',
                          'Social due diligence',
                          'Retention risk analysis & 90-day plan',
                          'Market-tested job positioning',
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#1d1d1f' }}>
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#72a89d' }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-2">
                      <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-btn text-sm font-medium text-white hover:opacity-88 transition-all"
                        style={{ backgroundColor: '#2814ff' }}>
                        Book a Discovery Call<ArrowRight className="w-4 h-4" />
                      </a>
                      <p className="text-xs mt-2" style={{ color: '#a1a1a6' }}>30 minutes. No obligation. We'll walk through your analysis together.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-2 pt-6 border-t" style={{ borderColor: '#d2d2d7' }}>
            {results.aiAnalysisSuccess !== false && (
              <button onClick={handleGenerateJD} disabled={jdLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-medium text-white transition-all duration-200 hover:opacity-88 disabled:opacity-50"
                style={{ backgroundColor: '#2814ff' }}
                aria-label="Generate a job description based on this analysis">
                {jdLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileEdit className="w-3.5 h-3.5" />}
                {jdLoading ? 'Generating...' : jdContent ? 'Regenerate JD' : 'Generate Job Description'}
              </button>
            )}
            <button onClick={() => { setEmailForReport(formData.email || ''); setShowEmailModal(true); setEmailSent(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-medium transition-all duration-200 hover:opacity-80 border"
              style={{ backgroundColor: '#ffffff', borderColor: '#d2d2d7', color: '#6e6e73' }}
              aria-label="Email the analysis report">
              <Mail className="w-3.5 h-3.5" />Email
            </button>
            <button onClick={generateShareUrl}
              className="flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-medium transition-all duration-200 hover:opacity-80 border"
              style={{ backgroundColor: '#ffffff', borderColor: '#d2d2d7', color: '#6e6e73' }}
              aria-label="Generate a shareable link for this analysis">
              <Share2 className="w-3.5 h-3.5" />Share
            </button>
            <button onClick={runComparison}
              className="flex items-center gap-2 px-4 py-2.5 rounded-btn text-xs font-medium transition-all duration-200 hover:opacity-80 border"
              style={{ backgroundColor: '#ffffff', borderColor: '#d2d2d7', color: '#6e6e73' }}
              aria-label="Compare budget impacts and alternatives">
              <RefreshCw className="w-3.5 h-3.5" />Compare
            </button>
          </div>

          {/* Generated Job Description */}
          {jdContent && (
            <div className="mt-6 rounded-card border overflow-hidden animate-fadeInUp" style={{ borderColor: '#d2d2d7' }}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ backgroundColor: '#f5f5f3', borderColor: '#d2d2d7' }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: '#2814ff' }} />
                  <h4 className="font-semibold text-sm" style={{ color: '#1d1d1f' }}>Generated Job Description</h4>
                </div>
                <button onClick={copyJD}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200 border"
                  style={jdCopied
                    ? { backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#dcfce7' }
                    : { backgroundColor: '#ffffff', color: '#6e6e73', borderColor: '#d2d2d7' }
                  }>
                  <ClipboardCopy className="w-3 h-3" />
                  {jdCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="px-5 py-5 bg-white">
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed"
                  style={{ color: '#1d1d1f' }}
                  dangerouslySetInnerHTML={{ __html: formatJDContent(jdContent) }} />
              </div>
              <div className="px-5 py-2.5 border-t" style={{ backgroundColor: '#f5f5f3', borderColor: '#d2d2d7' }}>
                <p className="text-[11px]" style={{ color: '#a1a1a6' }}>AI-generated. Review and customize before posting.</p>
              </div>
            </div>
          )}
        </div>

        {/* Budget Comparison Panel */}
        {compareMode && comparisonResults && (
          <div className="bg-white rounded-card shadow-card p-6" style={{ border: '1px solid #d2d2d7' }}>
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold text-lg" style={{ color: '#1d1d1f' }}>What Happens If You Adjust the Budget?</h4>
              <button onClick={() => setCompareMode(false)} className="transition-opacity hover:opacity-50" style={{ color: '#a1a1a6' }}><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonResults.withDecrease ? (
                <div className="rounded-card p-4 border" style={{ backgroundColor: 'rgba(244, 114, 124, 0.08)', borderColor: 'rgba(244, 114, 124, 0.3)' }}>
                  <h5 className="font-medium mb-2 text-sm" style={{ color: '#1d1d1f' }}>If Budget: {comparisonResults.prevLabel}</h5>
                  <div className="text-2xl font-semibold" style={{ color: '#f47278' }}>{comparisonResults.withDecrease.score}/10</div>
                  <p className="text-xs mt-1" style={{ color: '#a1a1a6' }}>{comparisonResults.withDecrease.label}</p>
                  {comparisonResults.withDecrease.score > comparisonResults.current.score ? (
                    <p className="text-xs font-medium mt-2" style={{ color: '#1d1d1f' }}>+{comparisonResults.withDecrease.score - comparisonResults.current.score} points harder</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: '#a1a1a6' }}>Already below market — timeline and location drive score</p>
                  )}
                </div>
              ) : (
                <div className="rounded-card p-4 border" style={{ backgroundColor: '#eeeeff', borderColor: '#d2d2d7' }}>
                  <h5 className="font-medium mb-2 text-sm" style={{ color: '#a1a1a6' }}>Lower Budget</h5>
                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Already at minimum range</p>
                </div>
              )}

              <div className="rounded-card p-4 border-2" style={{ backgroundColor: 'rgba(40, 20, 255, 0.04)', borderColor: '#2814ff' }}>
                <h5 className="font-medium mb-2 text-sm" style={{ color: '#1d1d1f' }}>Your Budget (Current)</h5>
                <div className="text-2xl font-semibold" style={{ color: '#2814ff' }}>{comparisonResults.current.score}/10</div>
                <p className="text-xs mt-1" style={{ color: '#a1a1a6' }}>{comparisonResults.current.label}</p>
              </div>

              {comparisonResults.withIncrease ? (
                <div className="rounded-card p-4 border" style={{ backgroundColor: 'rgba(97, 205, 187, 0.08)', borderColor: 'rgba(97, 205, 187, 0.3)' }}>
                  <h5 className="font-medium mb-2 text-sm" style={{ color: '#1d1d1f' }}>If Budget: {comparisonResults.nextLabel}</h5>
                  <div className="text-2xl font-semibold" style={{ color: '#61cdbb' }}>{comparisonResults.withIncrease.score}/10</div>
                  <p className="text-xs mt-1" style={{ color: '#a1a1a6' }}>{comparisonResults.withIncrease.label}</p>
                  {comparisonResults.current.score > comparisonResults.withIncrease.score ? (
                    <p className="text-xs font-medium mt-2" style={{ color: '#1d1d1f' }}>✓ {comparisonResults.current.score - comparisonResults.withIncrease.score} points easier</p>
                  ) : (
                    <p className="text-xs mt-2 font-medium" style={{ color: '#a1a1a6' }}>≈ No change — see note below</p>
                  )}
                </div>
              ) : (
                <div className="rounded-card p-4 border" style={{ backgroundColor: '#eeeeff', borderColor: '#d2d2d7' }}>
                  <h5 className="font-medium mb-2 text-sm" style={{ color: '#a1a1a6' }}>Higher Budget</h5>
                  <p className="text-xs" style={{ color: '#a1a1a6' }}>Already at maximum range</p>
                </div>
              )}
            </div>
            {comparisonResults.withIncrease && comparisonResults.current.score === comparisonResults.withIncrease.score ? (
              <div className="rounded-card p-3 mt-4" style={{ backgroundColor: 'rgba(120, 113, 0, 0.08)', border: '1px solid rgba(120, 113, 0, 0.3)' }}>
                <p className="text-sm" style={{ color: '#1d1d1f' }}>
                  <strong>Good news:</strong> Your budget is already competitive for this role. What's making the search tricky has more to do with timing, location, and how specialized the role is — not money.
                </p>
              </div>
            ) : (
              <p className="text-xs mt-4 text-center" style={{ color: '#a1a1a6' }}>
                See how budget changes affect your search complexity score
              </p>
            )}
          </div>
        )}

        {/* Final CTA - Subtle Card */}
        <div className="bg-white rounded-card shadow-card p-6 border" style={{ borderColor: '#d2d2d7' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: '#1d1d1f' }}>Ready for the Full Picture?</h3>
              <p className="text-sm" style={{ color: '#6e6e73' }}>A sourcing plan built for your search, compensation benchmarks, and an interview framework — all tailored to you</p>
            </div>
            <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-btn font-medium text-white hover:opacity-88 transition-all"
              style={{ backgroundColor: '#2814ff' }}>
              Schedule<ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Methodology & Data Sources - Collapsible */}
        <div className="rounded-card border overflow-hidden" style={{ backgroundColor: '#f5f5f3', borderColor: '#d2d2d7' }}>
          <button
            onClick={() => setMethodologyExpanded(!methodologyExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" style={{ color: '#2814ff' }} />
              <h4 className="font-semibold" style={{ color: '#1d1d1f' }}>About This Analysis</h4>
            </div>
            <ChevronDown
              className="w-5 h-5 transition-transform"
              style={{ color: '#a1a1a6', transform: methodologyExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </button>

          {methodologyExpanded && (
            <div className="px-6 pb-4 border-t space-y-4" style={{ borderColor: '#d2d2d7' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-btn border" style={{ borderColor: '#d2d2d7' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#1d1d1f' }}>{commonRoles.length} Roles Tracked</div>
                  <div className="text-xs" style={{ color: '#a1a1a6' }}>Across family office, household, estate, and maritime positions</div>
                </div>
                <div className="p-3 bg-white rounded-btn border" style={{ borderColor: '#d2d2d7' }}>
                  <div className="text-sm font-semibold mb-1" style={{ color: '#1d1d1f' }}>Data Updated {SALARY_DATA_META.lastUpdated}</div>
                  <div className="text-xs" style={{ color: '#a1a1a6' }}>v{SALARY_DATA_META.version} · {SALARY_DATA_META.sources?.length || 0} data sources aggregated</div>
                </div>
              </div>

              <div className="space-y-2 text-sm" style={{ color: '#6e6e73' }}>
                <p><strong>Our Methodology:</strong> Salary benchmarks are aggregated from industry sources, completed placements, and compensation surveys across family offices, private estates, and UHNW households.</p>
                <p><strong>Complexity Scoring:</strong> Our algorithm weighs {SALARY_DATA_META.scoringFactors?.length || 9} key factors including timeline urgency, location tier, language requirements, and market scarcity to provide an accurate difficulty assessment.</p>
              </div>

              {/* Data Sources */}
              {SALARY_DATA_META.sources && (
                <div className="pt-3 border-t" style={{ borderColor: '#d2d2d7' }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#a1a1a6' }}>Data Sources</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {SALARY_DATA_META.sources.map((source, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#a1a1a6' }}>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0 mt-0.5" style={{ backgroundColor: '#ffffff', color: '#2814ff' }}>{source.type}</span>
                        <div>
                          <span className="font-medium" style={{ color: '#6e6e73' }}>{source.name}</span>
                          <span> — {source.coverage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring Factors */}
              {SALARY_DATA_META.scoringFactors && (
                <div className="pt-3 border-t" style={{ borderColor: '#d2d2d7' }}>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#a1a1a6' }}>Complexity Scoring Factors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SALARY_DATA_META.scoringFactors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 bg-white rounded-full text-[11px] border" style={{ borderColor: '#d2d2d7', color: '#6e6e73' }}>{factor}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs pt-3 border-t" style={{ borderColor: '#d2d2d7', color: '#a1a1a6' }}>Analysis combines market data with AI-assisted insights. Results are guidance only — every search is unique. For personalized advice, schedule a consultation with Talent Gurus.</p>
            </div>
          )}
        </div>

        <button onClick={resetForm} className="w-full text-center text-xs py-4 transition-opacity hover:opacity-50" style={{ color: '#a1a1a6' }}>
          &larr; Start New Analysis
        </button>
      </div>
    </>
  );
}
