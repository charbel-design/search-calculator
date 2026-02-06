import React, { useState, useEffect } from 'react';
import {
  Share2, Mail, X, AlertCircle, CheckCircle, DollarSign, Clock, TrendingUp, Users, Target, Home, Car, Heart,
  SlidersHorizontal, Layers, Lightbulb, ArrowRight, ArrowLeftRight, Brain, GitBranch, Gauge, BarChart3,
  AlertTriangle, Info, RefreshCw, ArrowLeftCircle, ChevronDown, Compass, MessageCircle, FileText, Shield
} from 'lucide-react';
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
  showShareModal, setShowShareModal, shareUrl, copiedShare, copyShareUrl,
  showEmailModal, setShowEmailModal, emailForReport, setEmailForReport,
  handleSendEmail, sendingEmail, emailSent, setEmailSent, generateShareUrl, runComparison,
  resetForm, showLanguages, setShowLanguages, commonRoles
}) {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [methodologyExpanded, setMethodologyExpanded] = useState(false);

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
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200" aria-live="polite" role="region" aria-label="Analysis results">
          {/* Shared Result Banner */}
          {results.isSharedResult && (
            <div className="bg-brand-50 rounded-xl p-4 mb-6 flex items-start gap-3 border border-brand-100 animate-fadeInUp">
              <Share2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-brand-600">This is a shared analysis</p>
                <p className="text-xs text-brand-500 mt-1">Results are based on our scoring algorithm. For AI-powered insights, start a new analysis.</p>
              </div>
            </div>
          )}

          {/* Score Section - Always Visible (Top) */}
          <div className="text-center mb-6 animate-fadeInUp">
            <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 shadow-lg score-reveal"
              role="img" aria-label={`Search complexity score: ${results.score} out of 10, ${results.label} search`}
              style={{ backgroundColor: getComplexityColor(results.score).bg, borderColor: '#2814ff' }}>
              <div className="text-center">
                <div className="text-4xl font-bold leading-tight" style={{ color: getComplexityColor(results.score).text }}>
                  <ScoreCounter target={results.score} />
                </div>
                <div className="text-xs font-medium mt-1" style={{ color: getComplexityColor(results.score).text }}>out of 10</div>
              </div>
            </div>
            <div className="inline-block px-5 py-2 rounded-full font-semibold mb-2 animate-fadeInUp delay-100"
              style={{ backgroundColor: getComplexityColor(results.score).bg, color: getComplexityColor(results.score).text }}>
              {results.label} Search
            </div>
            <p className="text-sm text-slate-500 animate-fadeInUp delay-200">Confidence: {results.confidence}</p>
          </div>

          {/* Bottom Line */}
          {results.bottomLine && (
            <div className="bg-slate-50 rounded-xl p-5 mb-6 border-l-4 animate-fadeInUp delay-200" style={{ borderColor: '#2814ff' }}>
              <p className="text-slate-800">{results.bottomLine}</p>
              {results.aiAnalysisSuccess === false && (
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Results based on market data. AI insights temporarily unavailable.
                </p>
              )}
            </div>
          )}

          {/* Quick Metrics Strip - Unified Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 animate-fadeInUp delay-300">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" style={{ color: '#2814ff' }} />
                <p className="text-xs text-slate-600 font-medium">Salary</p>
              </div>
              <p className="text-sm font-semibold text-slate-800">{results.salaryRangeGuidance}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: '#2814ff' }} />
                <p className="text-xs text-slate-600 font-medium">Timeline</p>
              </div>
              <p className="text-sm font-semibold text-slate-800">{results.estimatedTimeline}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" style={{ color: '#2814ff' }} />
                <p className="text-xs text-slate-600 font-medium">Availability</p>
              </div>
              <p className="text-sm font-semibold text-slate-800">{results.candidateAvailability}</p>
            </div>
          </div>

          {/* What-If Scenarios - Collapsible */}
          <div className="mb-6 animate-fadeInUp delay-400">
            <div className="bg-gradient-to-br from-brand-50 to-b-pink-50 rounded-xl border border-brand-100 overflow-hidden">
              <button
                onClick={() => setWhatIfMode(!whatIfMode)}
                className="w-full p-5 flex items-center justify-between hover:bg-brand-50/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" style={{ color: '#2814ff' }} />
                  <h4 className="font-semibold text-sm" style={{ color: '#2814ff' }}>Play with the Numbers</h4>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${whatIfMode ? 'rotate-180' : ''}`} style={{ color: '#2814ff' }} />
              </button>

              {whatIfMode && (
              <div className="px-5 pb-5">
              <p className="text-sm text-slate-600 mb-4">Curious how a different timeline or budget changes things? Try it out.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Timeline</label>
                  <CustomSelect name="whatIfTimeline" value={whatIfTimeline || formData.timeline}
                    onChange={(e) => setWhatIfTimeline(e.target.value)}
                    options={timelineOptions} placeholder="Select timeline" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Budget</label>
                  <CustomSelect name="whatIfBudget" value={whatIfBudget || formData.budgetRange}
                    onChange={(e) => setWhatIfBudget(e.target.value)}
                    options={budgetRanges} placeholder="Select budget range" />
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
          </div>

          {/* Single CTA Button - Primary */}
          <div className="flex justify-center mb-6 animate-fadeInUp delay-500">
            <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#2814ff' }}>
              Let's Build Your Strategy<ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Tabbed Sections */}
          <div className="mb-6 animate-fadeInUp delay-600">
            <div className="flex gap-2 border-b border-slate-200 mb-4 overflow-x-auto">
              {[
                { id: 'breakdown', label: 'Breakdown' },
                { id: 'strategy', label: 'Strategy' },
                { id: 'market', label: 'Market' },
                { id: 'decision', label: 'Insights' },
                { id: 'next', label: "What's Next" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-slate-900'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                  style={activeTab === tab.id ? { color: '#2814ff', borderColor: '#2814ff' } : {}}
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
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: '#2814ff' }}>
                      <Layers className="w-5 h-5" />What Makes This Search Tricky
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

                  {/* Benchmarks */}
                  {results.benchmark && (
                    <div className="bg-slate-50 rounded-xl p-5">
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
                </div>
              )}

              {/* STRATEGY TAB */}
              {activeTab === 'strategy' && (
                <div className="space-y-6 animate-fadeInUp">
                  {/* Success Factors */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><CheckCircle className="w-5 h-5" />Success Factors</h4>
                    <ul className="space-y-2">
                      {results.keySuccessFactors?.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2814ff' }} />
                          <span className="text-slate-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  {results.recommendedAdjustments?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><Lightbulb className="w-5 h-5" />Recommendations</h4>
                      <ul className="space-y-2">
                        {results.recommendedAdjustments.map((r, i) => (
                          <li key={i} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2814ff' }} />
                            <span className="text-slate-700">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sourcing Insight */}
                  {results.sourcingInsight && (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5" style={{ color: '#2814ff' }} />
                        <h4 className="font-semibold text-sm">Where to Find These Candidates</h4>
                      </div>
                      <p className="text-slate-700">{results.sourcingInsight}</p>
                    </div>
                  )}

                  {/* Red Flag Analysis */}
                  {results.redFlagAnalysis && results.redFlagAnalysis !== "None - well-positioned search" && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><AlertCircle className="w-5 h-5" />Watch Out For</h4>
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-slate-700 text-amber-900">{results.redFlagAnalysis}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MARKET TAB */}
              {activeTab === 'market' && (
                <div className="space-y-6 animate-fadeInUp">
                  {/* Market Intelligence */}
                  {results.benchmark?.trends && (
                    <div>
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

                  {/* Search Intelligence */}
                  {results.benchmark && (
                    <div className="space-y-6 animate-fadeInUp">
                      <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2814ff' }}>
                        <Brain className="w-5 h-5" />The Numbers Behind the Search
                      </h4>

                      {/* Row 1: Offer Acceptance Rate & Counter-Offer Rate */}
                      {(results.benchmark.offerAcceptanceRate !== undefined || results.benchmark.counterOfferRate !== undefined) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.benchmark.offerAcceptanceRate !== undefined && (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center">
                              <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-medium">Offer Acceptance Rate</p>
                              <p className="text-4xl font-bold mb-2" style={{ color: '#2814ff' }}>
                                {Math.round(results.benchmark.offerAcceptanceRate * 100)}%
                              </p>
                              <p className="text-xs text-slate-500">~{Math.round(results.benchmark.offerAcceptanceRate * 10)} candidates per placement</p>
                            </div>
                          )}
                          {results.benchmark.counterOfferRate !== undefined && (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center">
                              <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-medium">Counter-Offer Rate</p>
                              <p className="text-4xl font-bold mb-2" style={{ color: '#2814ff' }}>
                                {Math.round(results.benchmark.counterOfferRate * 100)}%
                              </p>
                              <p className="text-xs text-slate-500">Risk of candidate retention</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Row 2: Sourcing Channel Mix */}
                      {results.benchmark.sourcingChannels && (
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                          <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-medium">Sourcing Channel Mix</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {results.benchmark.sourcingChannels.referral !== undefined && (
                              <div className="text-center">
                                <p className="text-2xl font-bold mb-1" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.sourcingChannels.referral * 100)}%
                                </p>
                                <p className="text-xs text-slate-500">Referral</p>
                              </div>
                            )}
                            {results.benchmark.sourcingChannels.agency !== undefined && (
                              <div className="text-center">
                                <p className="text-2xl font-bold mb-1" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.sourcingChannels.agency * 100)}%
                                </p>
                                <p className="text-xs text-slate-500">Agency</p>
                              </div>
                            )}
                            {results.benchmark.sourcingChannels.direct !== undefined && (
                              <div className="text-center">
                                <p className="text-2xl font-bold mb-1" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.sourcingChannels.direct * 100)}%
                                </p>
                                <p className="text-xs text-slate-500">Direct</p>
                              </div>
                            )}
                            {results.benchmark.sourcingChannels.internal !== undefined && (
                              <div className="text-center">
                                <p className="text-2xl font-bold mb-1" style={{ color: '#2814ff' }}>
                                  {Math.round(results.benchmark.sourcingChannels.internal * 100)}%
                                </p>
                                <p className="text-xs text-slate-500">Internal</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Row 3: Compact Stats */}
                      {(results.benchmark.salaryGrowthRate !== undefined ||
                        results.benchmark.typicalExperience !== undefined) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.benchmark.salaryGrowthRate !== undefined && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                              <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-medium">Salary Growth YoY</p>
                              <p className="text-3xl font-bold" style={{ color: '#2814ff' }}>
                                {Math.round(results.benchmark.salaryGrowthRate * 100)}%
                              </p>
                            </div>
                          )}
                          {results.benchmark.typicalExperience && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                              <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-medium">Typical Experience</p>
                              <p className="text-3xl font-bold" style={{ color: '#2814ff' }}>
                                {results.benchmark.typicalExperience.typical}y
                              </p>
                              {results.benchmark.typicalExperience.min && (
                                <p className="text-xs text-slate-500 mt-1">{results.benchmark.typicalExperience.min}+ years min</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Row 4: Retention & Compensation */}
                      {(results.benchmark.retentionRisk !== undefined ||
                        results.benchmark.compensationStructure !== undefined ||
                        results.benchmark.relocationWillingness !== undefined) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left: Retention & Relocation */}
                          {(results.benchmark.retentionRisk !== undefined ||
                            results.benchmark.relocationWillingness !== undefined) && (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                              <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-medium">Retention & Relocation</p>
                              <div className="space-y-4">
                                {results.benchmark.retentionRisk?.firstYearAttrition !== undefined && (
                                  <div>
                                    <p className="text-sm text-slate-600 mb-1">First-Year Attrition</p>
                                    <p className="text-2xl font-bold" style={{ color: '#2814ff' }}>
                                      {Math.round(results.benchmark.retentionRisk.firstYearAttrition * 100)}%
                                    </p>
                                  </div>
                                )}
                                {results.benchmark.relocationWillingness !== undefined && (
                                  <div>
                                    <p className="text-sm text-slate-600 mb-1">Relocation Willingness</p>
                                    <p className="text-2xl font-bold" style={{ color: '#2814ff' }}>
                                      {Math.round(results.benchmark.relocationWillingness * 100)}%
                                    </p>
                                  </div>
                                )}
                                {results.benchmark.retentionRisk?.topReasons && results.benchmark.retentionRisk.topReasons.length > 0 && (
                                  <div className="pt-3 border-t border-slate-200">
                                    <p className="text-xs text-slate-500 font-medium mb-2">Top Departure Risks</p>
                                    <div className="flex flex-wrap gap-2">
                                      {results.benchmark.retentionRisk.topReasons.map((reason, i) => (
                                        <span key={i} className="inline-block px-2 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600">
                                          {reason}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Right: Compensation Structure */}
                          {results.benchmark.compensationStructure && (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                              <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-medium">Compensation Structure</p>
                              <div className="space-y-4">
                                {(results.benchmark.compensationStructure.basePercent !== undefined ||
                                  results.benchmark.compensationStructure.bonusPercent !== undefined ||
                                  results.benchmark.compensationStructure.benefitsPercent !== undefined) && (
                                  <div>
                                    <p className="text-sm text-slate-600 mb-3">Typical Split</p>
                                    <div className="space-y-2">
                                      {results.benchmark.compensationStructure.basePercent !== undefined && (
                                        <div>
                                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>Base Salary</span>
                                            <span className="font-medium">{Math.round(results.benchmark.compensationStructure.basePercent * 100)}%</span>
                                          </div>
                                          <div className="h-2 bg-white rounded-full overflow-hidden">
                                            <div
                                              className="h-full"
                                              style={{ backgroundColor: '#2814ff', width: `${Math.round(results.benchmark.compensationStructure.basePercent * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                      {results.benchmark.compensationStructure.bonusPercent !== undefined && (
                                        <div>
                                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>Bonus</span>
                                            <span className="font-medium">{Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%</span>
                                          </div>
                                          <div className="h-2 bg-white rounded-full overflow-hidden">
                                            <div
                                              className="h-full"
                                              style={{ backgroundColor: '#9ca3af', width: `${Math.round(results.benchmark.compensationStructure.bonusPercent * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                      {results.benchmark.compensationStructure.benefitsPercent !== undefined && (
                                        <div>
                                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                                            <span>Benefits</span>
                                            <span className="font-medium">{Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%</span>
                                          </div>
                                          <div className="h-2 bg-white rounded-full overflow-hidden">
                                            <div
                                              className="h-full"
                                              style={{ backgroundColor: '#cbd5e1', width: `${Math.round(results.benchmark.compensationStructure.benefitsPercent * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {(results.benchmark.compensationStructure.signingBonusFrequency !== undefined ||
                                  results.benchmark.compensationStructure.signingBonusRange) && (
                                  <div className="pt-3 border-t border-slate-200">
                                    <p className="text-sm text-slate-600 mb-2">Signing Bonus</p>
                                    <div className="space-y-1">
                                      {results.benchmark.compensationStructure.signingBonusFrequency !== undefined && (
                                        <p className="text-sm font-medium" style={{ color: '#2814ff' }}>
                                          {Math.round(results.benchmark.compensationStructure.signingBonusFrequency * 100)}% offer signing bonus
                                        </p>
                                      )}
                                      {results.benchmark.compensationStructure.signingBonusRange && (
                                        <p className="text-xs text-slate-500">
                                          {results.benchmark.compensationStructure.signingBonusRange}
                                        </p>
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

                  {/* Negotiation Leverage */}
                  {results.negotiationLeverage && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><ArrowLeftRight className="w-5 h-5" />Negotiation Leverage</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <h5 className="font-medium mb-2 text-sm" style={{ color: '#2814ff' }}>Candidate Advantages</h5>
                          <ul className="space-y-1">{results.negotiationLeverage.candidateAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <h5 className="font-medium mb-2 text-sm" style={{ color: '#2814ff' }}>Your Advantages</h5>
                          <ul className="space-y-1">{results.negotiationLeverage.employerAdvantages?.map((a, i) => <li key={i} className="text-sm text-slate-700">• {a}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Market Competitiveness Detail */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" style={{ color: '#2814ff' }} />
                      <h4 className="font-semibold text-sm">Market Competitiveness</h4>
                    </div>
                    <p className="text-slate-700">{results.marketCompetitiveness}</p>
                  </div>
                </div>
              )}

              {/* DECISION INTELLIGENCE TAB */}
              {activeTab === 'decision' && results.decisionIntelligence && (
                <div className="space-y-6 animate-fadeInUp">
                  <p className="text-sm text-slate-600 mb-4">Here's the strategic picture. We've started the analysis — the full deep-dive happens when we talk.</p>

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
                              <span className="font-medium" style={{ color: '#2814ff' }}>→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs text-slate-500">{results.decisionIntelligence.tradeoffScenarios.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Candidate Psychology */}
                    {results.decisionIntelligence.candidatePsychology && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d2d4ff' }}>
                            <Users className="w-4 h-4" style={{ color: '#2814ff' }} />
                          </div>
                          <h5 className="font-semibold text-slate-900">What Top Candidates Care About</h5>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.candidatePsychology.initial?.map((item, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                              <span style={{ color: '#2814ff' }} className="font-medium">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                          <span className="text-xs text-slate-500">{results.decisionIntelligence.candidatePsychology.completeTeaser}</span>
                        </div>
                      </div>
                    )}

                    {/* Probability & Mandate Strength Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.decisionIntelligence.probabilityOfSuccess && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d2d4ff' }}>
                              <Gauge className="w-4 h-4" style={{ color: '#2814ff' }} />
                            </div>
                            <h5 className="font-semibold text-slate-900">Success Probability</h5>
                          </div>
                          <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                              {(() => {
                                const conf = results.decisionIntelligence.probabilityOfSuccess.initialConfidence || '';
                                const pctMatch = conf.match(/(\d+)%/);
                                const pct = pctMatch ? pctMatch[1] : null;
                                const rest = pct ? conf.replace(/^\d+%\s*/, '') : conf;
                                return pct ? (
                                  <>
                                    <span className="text-3xl font-bold" style={{ color: '#2814ff' }}>{pct}%</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'High'
                                        ? 'bg-b-opal-50 text-b-opal-600'
                                        : results.decisionIntelligence.probabilityOfSuccess.initialLabel === 'Moderate'
                                        ? 'bg-b-ocre-50 text-b-ocre-500'
                                        : 'bg-b-pink-50 text-b-pink-500'
                                    }`}>{results.decisionIntelligence.probabilityOfSuccess.initialLabel}</span>
                                  </>
                                ) : (
                                  <span className="text-3xl font-bold" style={{ color: '#2814ff' }}>{results.decisionIntelligence.probabilityOfSuccess.initialLabel}</span>
                                );
                              })()}
                            </div>
                            {(() => {
                              const conf = results.decisionIntelligence.probabilityOfSuccess.initialConfidence || '';
                              const rest = conf.replace(/^\d+%\s*/, '');
                              return rest ? <p className="text-sm text-slate-600 mt-1">{rest}</p> : null;
                            })()}
                          </div>
                          <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                            <span className="text-xs text-slate-500">{results.decisionIntelligence.probabilityOfSuccess.completeTeaser}</span>
                          </div>
                        </div>
                      )}

                      {results.decisionIntelligence.mandateStrength && (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#d2d4ff' }}>
                              <BarChart3 className="w-4 h-4" style={{ color: '#2814ff' }} />
                            </div>
                            <h5 className="font-semibold text-slate-900">How Strong Is This Brief?</h5>
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
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: '#2814ff' }} />
                            <span className="text-xs text-slate-500">{results.decisionIntelligence.mandateStrength.completeTeaser}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* False Signals */}
                    {results.decisionIntelligence.falseSignals && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          </div>
                          <h5 className="font-semibold text-amber-900">Don't Be Fooled By</h5>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {results.decisionIntelligence.falseSignals.initial?.map((item, i) => (
                            <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-amber-200 pt-3 flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-xs text-amber-700">{results.decisionIntelligence.falseSignals.completeTeaser}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WHAT'S NEXT TAB */}
              {activeTab === 'next' && (
                <div className="space-y-6 animate-fadeInUp">
                  <p className="text-sm text-slate-600">You've got the data. Here's how we turn it into a successful placement.</p>

                  {/* Process Steps */}
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        icon: MessageCircle,
                        title: 'Discovery Call',
                        duration: '30 min',
                        description: 'We walk through your analysis together, dig into the nuances that data alone can\'t capture, and align on what "the right person" actually looks like for your household or office.',
                      },
                      {
                        step: 2,
                        icon: Compass,
                        title: 'Sourcing Strategy',
                        duration: 'Week 1',
                        description: 'Based on your role complexity, location, and budget, we build a sourcing plan — which networks to tap, how to position the opportunity, and what the outreach looks like.',
                      },
                      {
                        step: 3,
                        icon: Users,
                        title: 'Curated Shortlist',
                        duration: 'Weeks 2–4',
                        description: 'You receive a vetted shortlist of candidates who match the brief. Each profile includes social due diligence, reference notes, and our honest assessment.',
                      },
                      {
                        step: 4,
                        icon: Shield,
                        title: 'Interview & Placement Support',
                        duration: 'Through close',
                        description: 'We coordinate interviews, handle reference checks, support offer negotiation, and stay involved through the first 90 days to make sure the placement sticks.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#2814ff' }}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          {idx < 3 && <div className="w-0.5 flex-1 mt-1 bg-brand-200" />}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-slate-900">{item.title}</h5>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">{item.duration}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What you get */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h5 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: '#2814ff' }} />
                      What the full engagement includes
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        'Compensation negotiation playbook',
                        'Social due diligence',
                        'Retention risk analysis & 90-day plan',
                        'Market-tested job positioning',
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#2814ff' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center pt-2">
                    <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white hover:shadow-lg transition-all"
                      style={{ backgroundColor: '#2814ff' }}>
                      Book a Discovery Call<ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-xs text-slate-500 mt-2">30 minutes. No obligation. We'll walk through your analysis together.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row - Below Tabs */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-200">
            <button onClick={() => { setEmailForReport(formData.email || ''); setShowEmailModal(true); setEmailSent(false); }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              aria-label="Email the analysis report">
              <Mail className="w-4 h-4" />Email Report
            </button>
            <button onClick={generateShareUrl}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              aria-label="Generate a shareable link for this analysis">
              <Share2 className="w-4 h-4" />Share Link
            </button>
            <button onClick={runComparison}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              aria-label="Compare budget impacts and alternatives">
              <RefreshCw className="w-4 h-4" />Compare Budgets
            </button>
          </div>
        </div>

        {/* Budget Comparison Panel */}
        {compareMode && comparisonResults && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>What Happens If You Adjust the Budget?</h4>
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
                  ) : (
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
                  ) : (
                    <p className="text-xs text-b-ocre-500 mt-2 font-medium">≈ No change — see note below</p>
                  )}
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
                  <strong>💡 Good news:</strong> Your budget is already competitive for this role. What's making the search tricky has more to do with timing, location, and how specialized the role is — not money.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-4 text-center">
                See how budget changes affect your search complexity score
              </p>
            )}
          </div>
        )}

        {/* Final CTA - Subtle Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Ready for the Full Picture?</h3>
              <p className="text-sm text-slate-600">A sourcing plan built for your search, compensation benchmarks, and an interview framework — all tailored to you</p>
            </div>
            <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#2814ff' }}>
              Schedule<ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Methodology & Data Sources - Collapsible */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setMethodologyExpanded(!methodologyExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" style={{ color: '#2814ff' }} />
              <h4 className="font-semibold text-slate-900">About This Analysis</h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 transition-transform ${methodologyExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {methodologyExpanded && (
            <div className="px-6 pb-4 border-t border-slate-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-sm font-semibold text-slate-800 mb-1">{commonRoles.length} Roles Tracked</div>
                  <div className="text-xs text-slate-500">Across family office, household, estate, and maritime positions</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-sm font-semibold text-slate-800 mb-1">Data Updated {SALARY_DATA_META.lastUpdated}</div>
                  <div className="text-xs text-slate-500">v{SALARY_DATA_META.version} · {SALARY_DATA_META.sources?.length || 0} data sources aggregated</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Our Methodology:</strong> Salary benchmarks are aggregated from industry databases, completed placements, and compensation surveys across family offices, private estates, and UHNW households.</p>
                <p><strong>Complexity Scoring:</strong> Our algorithm weighs {SALARY_DATA_META.scoringFactors?.length || 9} key factors including timeline urgency, location tier, language requirements, and market scarcity to provide an accurate difficulty assessment.</p>
              </div>

              {/* Data Sources */}
              {SALARY_DATA_META.sources && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Data Sources</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {SALARY_DATA_META.sources.map((source, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-100 text-brand-600 flex-shrink-0 mt-0.5">{source.type}</span>
                        <div>
                          <span className="font-medium text-slate-600">{source.name}</span>
                          <span className="text-slate-400"> — {source.coverage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scoring Factors */}
              {SALARY_DATA_META.scoringFactors && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Complexity Scoring Factors</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SALARY_DATA_META.scoringFactors.map((factor, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600">{factor}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 pt-3 border-t border-slate-200">Analysis combines market data with AI-assisted insights. Results are guidance only — every search is unique. For personalized advice, schedule a consultation with Talent Gurus.</p>
            </div>
          )}
        </div>

        <button onClick={resetForm} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-4">← Start New Analysis</button>
      </div>
    </>
  );
}
