import React from 'react';
import {
  MapPin, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Zap, ChevronDown
} from 'lucide-react';
import { BENCHMARKS } from '../salaryData';
import { CustomSelect } from './CustomSelect';

export function FormSteps({
  step, setStep, formData, setFormData, loading, loadingStep, error, setError,
  warnings, positionSearch, setPositionSearch, showPositionSuggestions, setShowPositionSuggestions,
  highlightedPositionIndex, setHighlightedPositionIndex, filteredPositions,
  showLocationSuggestions, setShowLocationSuggestions, highlightedLocationIndex, setHighlightedLocationIndex,
  filteredLocationSuggestions, handleInputChange, handleLocationKeyDown, handleMultiSelect,
  validateAndWarn, validateStep, nextStep, calculateComplexity,
  isCorporateRole, budgetRanges, timelineOptions, discretionLevels,
  householdLanguageOptions, corporateLanguageOptions, householdCertificationOptions,
  corporateCertificationOptions, travelOptions, corporateLanguageShortList,
  showLanguages, setShowLanguages, commonRoles
}) {
  const [showAllCerts, setShowAllCerts] = React.useState(false);
  const [showAllLangs, setShowAllLangs] = React.useState(false);

  // Live elapsed timer for loading overlay
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [loading]);

  const loadingLabels = [
    'Crunching the numbers',
    'Checking the market',
    'Putting your insights together',
    'Almost there'
  ];

  return (
    <>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Connecting line behind circles */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200">
            <div className="h-0.5 transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 3) * 100}%`, backgroundColor: '#2814ff' }} />
          </div>
          {['Role & Location', 'Budget & Timeline', 'Requirements', 'Analysis'].map((label, i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > i + 1 ? 'bg-brand-500 text-white' :
                step === i + 1 ? 'bg-brand-500 text-white ring-4 ring-brand-100' :
                'bg-slate-200 text-slate-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-2 transition-colors duration-300 ${step >= i + 1 ? 'font-semibold text-brand-500' : 'text-slate-400'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200" aria-label="Search parameters form">
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center animate-fadeInUp max-w-sm">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-brand-500 animate-spin mx-auto mb-6"></div>
              <div className="space-y-3">
                {loadingLabels.map((label, i) => {
                  const stepNum = i + 1;
                  const done = loadingStep > stepNum;
                  const active = loadingStep === stepNum;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        done ? 'bg-brand-500 text-white' :
                        active ? 'bg-brand-500 text-white ring-2 ring-brand-200' :
                        'bg-slate-200 text-slate-400'
                      }`}>
                        {done ? '✓' : stepNum}
                      </div>
                      <span className={`text-sm transition-colors duration-300 ${
                        done ? 'text-slate-400 line-through' :
                        active ? 'font-semibold text-brand-500' :
                        'text-slate-400'
                      }`}>{label}{active ? '...' : ''}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-slate-400 mt-5 tabular-nums">{elapsed}s elapsed</p>
            </div>
          </div>
        )}
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-slideInRight">
            <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Tell us about the role</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Position Type *</label>
              <div className="relative">
                <input type="text"
                  value={formData.positionType ? formData.positionType : positionSearch}
                  onChange={(e) => { setPositionSearch(e.target.value); setFormData({ ...formData, positionType: '' }); setShowPositionSuggestions(true); setHighlightedPositionIndex(-1); }}
                  onFocus={() => { setShowPositionSuggestions(true); if (formData.positionType) { setPositionSearch(''); setFormData({ ...formData, positionType: '' }); } }}
                  onBlur={() => setTimeout(() => { setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); }, 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedPositionIndex(prev => prev < filteredPositions.length - 1 ? prev + 1 : prev); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedPositionIndex(prev => prev > 0 ? prev - 1 : prev); }
                    else if (e.key === 'Enter' && highlightedPositionIndex >= 0) { e.preventDefault(); const selected = filteredPositions[highlightedPositionIndex]; setFormData({ ...formData, positionType: selected }); setPositionSearch(''); setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); }
                    else if (e.key === 'Escape') { setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); }
                  }}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all duration-200 focus:shadow-md"
                  placeholder="Type to search roles... (e.g., Estate Manager, CIO, Private Chef)"
                />
                {formData.positionType && (
                  <button type="button" onClick={() => { setFormData({ ...formData, positionType: '' }); setPositionSearch(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <span className="text-lg">×</span>
                  </button>
                )}
                {showPositionSuggestions && filteredPositions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-brand-50 border border-brand-100 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {filteredPositions.map((role, idx) => (
                      <button key={role} type="button"
                        onClick={() => { setFormData({ ...formData, positionType: role }); setPositionSearch(''); setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); }}
                        onMouseEnter={() => setHighlightedPositionIndex(idx)}
                        className={`w-full text-left px-4 py-2.5 text-sm border-b border-brand-100/50 ${idx === highlightedPositionIndex ? 'bg-brand-200 text-brand-700' : 'hover:bg-brand-100 text-slate-700'}`}>
                        {role}
                        {BENCHMARKS[role] && <span className="text-xs text-slate-400 ml-2">${BENCHMARKS[role].p50.toLocaleString()}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {showPositionSuggestions && positionSearch && filteredPositions.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-brand-50 border border-brand-100 rounded-xl shadow-lg p-4 text-center text-sm text-slate-500">
                    No roles match "{positionSearch}"
                  </div>
                )}
              </div>
              {formData.positionType && BENCHMARKS[formData.positionType] && (
                <div className="mt-2 text-xs text-slate-500 space-y-1">
                  <p>Market: ${BENCHMARKS[formData.positionType].p25.toLocaleString()} - ${BENCHMARKS[formData.positionType].p75.toLocaleString()}</p>
                  {BENCHMARKS[formData.positionType].scarcity && (
                    <p>Market scarcity: {BENCHMARKS[formData.positionType].scarcity}/10 {BENCHMARKS[formData.positionType].scarcity >= 7 ? '(Hard to find)' : BENCHMARKS[formData.positionType].scarcity >= 5 ? '(Moderate)' : '(Widely available)'}</p>
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:shadow-md focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="e.g., Palm Beach, FL or Monaco" />
              </div>
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-brand-50 border border-brand-100 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {filteredLocationSuggestions.map((loc, idx) => (
                    <button key={idx} type="button"
                      ref={idx === highlightedLocationIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
                      onClick={() => { setFormData({ ...formData, location: loc }); setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }}
                      onMouseEnter={() => setHighlightedLocationIndex(idx)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${idx === highlightedLocationIndex ? 'bg-brand-200 text-brand-700' : 'hover:bg-brand-100'}`}>
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Discretion Level</label>
              <CustomSelect name="discretionLevel" value={formData.discretionLevel} onChange={handleInputChange}
                options={discretionLevels.map(d => ({ value: d.value, label: `${d.label} — ${d.description}` }))} placeholder="Select discretion level" />
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-slideInRight">
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
              <CustomSelect name="budgetRange" value={formData.budgetRange} onChange={handleInputChange}
                options={budgetRanges} placeholder="Select budget range" />
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
          <div className="space-y-6 animate-slideInRight">
            <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Key Requirements</h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isCorporateRole ? 'Professional Certifications' : 'Certifications'}
                {isCorporateRole && <span className="text-xs text-slate-500 ml-2">(Finance/Investment)</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).slice(0, showAllCerts ? undefined : 6).map(cert => (
                  <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                    className={`px-3 py-1.5 rounded-full text-sm ${formData.certifications.includes(cert) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {cert}
                  </button>
                ))}
              </div>
              {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length > 6 && (
                <button type="button" onClick={() => setShowAllCerts(!showAllCerts)} className="mt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                  {showAllCerts ? 'Show less' : `Show all ${(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length} certifications`}
                </button>
              )}
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
                      {corporateLanguageShortList.slice(0, showAllLangs ? undefined : 8).map(lang => (
                        <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                          className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                    {corporateLanguageShortList.length > 8 && (
                      <button type="button" onClick={() => setShowAllLangs(!showAllLangs)} className="mt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                        {showAllLangs ? 'Show less' : `Show all ${corporateLanguageShortList.length} languages`}
                      </button>
                    )}
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
                  {householdLanguageOptions.slice(0, showAllLangs ? undefined : 8).map(lang => (
                    <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                      className={`px-3 py-1.5 rounded-full text-sm ${formData.languageRequirements.includes(lang) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                      {lang}
                    </button>
                  ))}
                </div>
                {householdLanguageOptions.length > 8 && (
                  <button type="button" onClick={() => setShowAllLangs(!showAllLangs)} className="mt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                    {showAllLangs ? 'Show less' : `Show all ${householdLanguageOptions.length} languages`}
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Travel Requirements</label>
              <CustomSelect name="travelRequirement" value={formData.travelRequirement} onChange={handleInputChange}
                options={travelOptions} placeholder="Select travel requirement" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additional Requirements *</label>
              <textarea name="keyRequirements" value={formData.keyRequirements} onChange={handleInputChange} rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:shadow-md focus:border-brand-500 focus:ring-2 focus:ring-brand-100" placeholder="Describe specific experience, skills..." />
              <p className={`text-xs mt-1 ${formData.keyRequirements.length >= 25 ? 'text-b-opal-500' : 'text-slate-500'}`}>
                {formData.keyRequirements.length} chars {formData.keyRequirements.length < 25 ? `(${25 - formData.keyRequirements.length} more needed)` : '✓'}
              </p>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-slideInRight">
            <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Get Your Analysis</h3>

            <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
              <div className="flex items-start gap-3 mb-3">
                <Zap className="w-6 h-6 flex-shrink-0" style={{ color: '#2814ff' }} />
                <h4 className="font-semibold text-slate-900">Almost there — let's wrap this up</h4>
              </div>
              <p className="text-sm text-slate-600">You're about to get salary benchmarks, a breakdown of what makes this role tricky, and a clear picture of the candidate market.</p>
            </div>

            {isCorporateRole ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assets Under Management (AUM)</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Size (Direct Reports)</label>
                  <CustomSelect name="teamSize" value={formData.teamSize} onChange={handleInputChange}
                    options={[
                      { value: '0', label: 'Individual contributor' },
                      { value: '1-3', label: '1-3 reports' },
                      { value: '4-10', label: '4-10 reports' },
                      { value: '10-plus', label: '10+ reports' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Properties to Staff</label>
                  <CustomSelect name="propertiesCount" value={formData.propertiesCount} onChange={handleInputChange}
                    options={[
                      { value: '1', label: '1' },
                      { value: '2-3', label: '2-3' },
                      { value: '4-6', label: '4-6' },
                      { value: '7+', label: '7+' },
                    ]} placeholder="Select..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Household Size</label>
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
            {step === 4 ? (<><Target className="w-5 h-5" />Get Analysis</>) : (<>Continue<ArrowRight className="w-5 h-5" /></>)}
          </button>
        </div>
      </div>
    </>
  );
}
