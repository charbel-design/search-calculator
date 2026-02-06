import React from 'react';
import {
  Share2, Mail, X, AlertCircle, CheckCircle, DollarSign, Clock, TrendingUp, Users, Target, Home, Car, Heart,
  SlidersHorizontal, Layers, Lightbulb, ArrowRight, ArrowLeftRight, Brain, GitBranch, Gauge, BarChart3,
  AlertTriangle, Info, RefreshCw, ArrowLeftCircle
} from 'lucide-react';
import { ShareModal, EmailModal } from './Modals';
import { getComplexityColor } from './constants';
import { SALARY_DATA_META } from '../salaryData';

export function ResultsView({
  results, formData, loading, compareMode, setCompareMode, comparisonResults,
  whatIfMode, setWhatIfMode, whatIfBudget, setWhatIfBudget, whatIfTimeline,
  setWhatIfTimeline, calculateWhatIfScore, timelineOptions, budgetRanges,
  showShareModal, setShowShareModal, shareUrl, copiedShare, copyShareUrl,
  showEmailModal, setShowEmailModal, emailForReport, setEmailForReport,
  handleSendEmail, sendingEmail, emailSent, generateShareUrl, runComparison,
  resetForm, showLanguages, setShowLanguages, commonRoles
}) {
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
              role="img" aria-label={`Search complexity score: ${results.score} out of 10, ${results.label} search`}
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

          {/* Bottom Line */}
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

          {/* CTA Strip */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-6 border border-brand-100 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-800">Need a tailored search strategy for this role?</p>
              <p className="text-xs text-slate-500 mt-0.5">30-minute strategy call · No commitment · Personalized to your search</p>
            </div>
            <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#2814ff' }}>
              Book a Call<ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* What-If Scenarios */}
          <div className="mb-6">
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
          <div className="mb-6">
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <div className="bg-brand-50 rounded-xl p-5 mb-6 border border-brand-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-brand-500" />
                <h4 className="font-semibold text-sm text-brand-600">Where to Find These Candidates</h4>
              </div>
              <p className="text-slate-700">{results.sourcingInsight}</p>
            </div>
          )}

          {/* Benchmarks */}
          {results.benchmark && (
            <div className="bg-slate-50 rounded-xl p-5 mb-6">
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
          <div className="mb-6">
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

          {/* Recommendations */}
          {results.recommendedAdjustments?.length > 0 && (
            <div className="mb-6">
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
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#2814ff' }}><AlertCircle className="w-5 h-5" />Red Flag Analysis</h4>
              <div className="bg-b-pink-50 rounded-xl p-4 border border-b-pink-200">
                <p className="text-slate-700">{results.redFlagAnalysis}</p>
              </div>
            </div>
          )}

          {/* Market Intelligence */}
          {results.benchmark?.trends && (
            <div className="mb-6">
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

          {/* Negotiation Leverage */}
          {results.negotiationLeverage && (
            <div className="mb-6">
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

          {/* Decision Intelligence */}
          {results.decisionIntelligence && (
            <div className="mb-6">
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
                      <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
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
                      <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
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
                        <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs text-slate-500">{results.decisionIntelligence.probabilityOfSuccess.completeTeaser}</span>
                      </div>
                    </div>
                  )}

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
                        <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-xs text-slate-500">{results.decisionIntelligence.mandateStrength.completeTeaser}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* False Signals */}
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
                      <ArrowRight className="w-3.5 h-3.5 text-b-ocre-400" />
                      <span className="text-xs text-b-ocre-500">{results.decisionIntelligence.falseSignals.completeTeaser}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-r from-brand-50 to-b-pink-50 rounded-xl p-5 border border-brand-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Go deeper with a search specialist</p>
                    <p className="text-xs text-slate-500 mt-1">Get the full decision intelligence breakdown, custom sourcing plan, and offer strategy for this role.</p>
                  </div>
                  <a href="https://calendly.com/charbel-talentgurus" target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                    style={{ backgroundColor: '#2814ff' }}>
                    Schedule Consultation<ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            <button onClick={() => { setEmailForReport(formData.email || ''); setShowEmailModal(true); setEmailSent(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700"
              aria-label="Email the analysis report">
              <Mail className="w-4 h-4" />Email Report
            </button>
            <button onClick={generateShareUrl}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700"
              aria-label="Generate a shareable link for this analysis">
              <Share2 className="w-4 h-4" />Share Link
            </button>
            <button onClick={runComparison}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700"
              aria-label="Compare budget impacts and alternatives">
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

        {/* Final CTA */}
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

        {/* Methodology & Data Sources */}
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
              <div className="text-xs text-slate-500">v{SALARY_DATA_META.version} · {SALARY_DATA_META.sources?.length || 0} data sources aggregated</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Our Methodology:</strong> Salary benchmarks are aggregated from industry databases, completed placements, and compensation surveys across family offices, private estates, and UHNW households.</p>
            <p><strong>Complexity Scoring:</strong> Our algorithm weighs {SALARY_DATA_META.scoringFactors?.length || 9} key factors including timeline urgency, location tier, language requirements, and market scarcity to provide an accurate difficulty assessment.</p>
          </div>

          {/* Data Sources */}
          {SALARY_DATA_META.sources && (
            <div className="mt-4 pt-4 border-t border-slate-200">
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
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Complexity Scoring Factors</p>
              <div className="flex flex-wrap gap-1.5">
                {SALARY_DATA_META.scoringFactors.map((factor, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-600">{factor}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200">Analysis combines market data with AI-assisted insights. Results are guidance only — every search is unique. For personalized advice, schedule a consultation with Talent Gurus.</p>
        </div>

        <button onClick={resetForm} className="w-full text-center text-sm text-slate-500 hover:text-slate-700 py-4">← Start New Analysis</button>
      </div>
    </>
  );
}
