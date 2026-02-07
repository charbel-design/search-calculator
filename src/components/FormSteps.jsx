import React from 'react';
import {
  MapPin, Clock, DollarSign, Target, AlertCircle, CheckCircle, ArrowRight, Info, Zap, ChevronDown, Search, Briefcase, Shield, Anchor
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
  isCorporateRole, isMaritimeRole, budgetRanges, timelineOptions, discretionLevels,
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
    { text: 'Crunching the numbers', icon: DollarSign },
    { text: 'Checking the market', icon: Search },
    { text: 'Building your insights', icon: Briefcase },
    { text: 'Almost there', icon: Zap }
  ];

  const stepMeta = [
    { label: 'Role', shortLabel: 'Role', icon: Search },
    { label: 'Budget', shortLabel: 'Budget', icon: DollarSign },
    { label: 'Requirements', shortLabel: 'Reqs', icon: Target },
    { label: 'Finalize', shortLabel: 'Go', icon: Zap }
  ];

  return (
    <>
      {/* Progress Indicator — Clean Linear Design */}
      <div className="mb-8">
        {/* Step counter text */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Step {step} of 4</span>
          <span className="text-xs text-slate-400">{stepMeta[step - 1].label}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step) / 4) * 100}%`, backgroundColor: '#2814ff' }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between">
          {stepMeta.map((meta, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            const Icon = meta.icon;
            return (
              <button
                key={i}
                onClick={() => { if (isCompleted) setStep(stepNum); }}
                disabled={!isCompleted}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-brand-500 text-white cursor-pointer hover:bg-brand-600 shadow-sm'
                    : isCurrent
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 shadow-md'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 animate-checkIn" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs transition-colors duration-300 step-label ${
                  isCurrent ? 'font-semibold text-brand-600' :
                  isCompleted ? 'font-medium text-brand-500' :
                  'text-slate-400'
                }`}>
                  <span className="hidden sm:inline">{meta.label}</span>
                  <span className="sm:hidden">{meta.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-5 sm:p-6 md:p-8 border border-slate-100 form-card" aria-label="Search parameters form">

        {/* Loading Overlay — Premium Design */}
        {loading && (
          <div className="fixed inset-0 loading-overlay flex items-center justify-center z-50">
            <div className="text-center animate-fadeInUp max-w-sm px-6">
              {/* Animated brand ring */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-brand-500 animate-spin" style={{ animationDuration: '1s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2814ff10' }}>
                    {React.createElement(loadingLabels[Math.min(loadingStep - 1, 3)]?.icon || Zap, {
                      className: 'w-5 h-5 animate-gentleFloat',
                      style: { color: '#2814ff' }
                    })}
                  </div>
                </div>
              </div>

              {/* Step checklist */}
              <div className="space-y-3 text-left max-w-xs mx-auto">
                {loadingLabels.map(({ text, icon: StepIcon }, i) => {
                  const stepNum = i + 1;
                  const done = loadingStep > stepNum;
                  const active = loadingStep === stepNum;
                  return (
                    <div key={i} className={`flex items-center gap-3 py-1 transition-all duration-300 ${active ? 'opacity-100' : done ? 'opacity-50' : 'opacity-40'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        done ? 'bg-b-opal-400 text-white' :
                        active ? 'bg-brand-500 text-white' :
                        'bg-slate-100 text-slate-400'
                      }`}>
                        {done ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <StepIcon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className={`text-sm transition-all duration-300 ${
                        done ? 'text-slate-400 line-through' :
                        active ? 'font-medium text-slate-700 loading-step-active' :
                        'text-slate-400'
                      }`}>{text}{active ? '...' : ''}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-400 mt-6 tabular-nums font-medium">{elapsed}s</p>
            </div>
          </div>
        )}

        {/* Step 1: Role & Location */}
        {step === 1 && (
          <div className="space-y-6 animate-slideInRight">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Tell us about the role</h3>
              <p className="text-sm text-slate-400">Start with the basics — what you're looking for and where.</p>
            </div>

            {/* Position Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position Type <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
                  className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all duration-200 text-sm"
                  placeholder="Search roles... (e.g., Estate Manager, CIO, Private Chef)"
                />
                {formData.positionType && (
                  <button type="button" onClick={() => { setFormData({ ...formData, positionType: '' }); setPositionSearch(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                )}
                {showPositionSuggestions && filteredPositions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto custom-scrollbar">
                    {filteredPositions.map((role, idx) => (
                      <button key={role} type="button"
                        onClick={() => { setFormData({ ...formData, positionType: role }); setPositionSearch(''); setShowPositionSuggestions(false); setHighlightedPositionIndex(-1); }}
                        onMouseEnter={() => setHighlightedPositionIndex(idx)}
                        className={`w-full text-left px-4 py-2.5 text-sm border-b border-slate-50 last:border-0 flex items-center justify-between ${idx === highlightedPositionIndex ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-700'}`}>
                        <span>{role}</span>
                        {BENCHMARKS[role] && <span className="text-xs text-slate-400 ml-2 tabular-nums">${BENCHMARKS[role].p50.toLocaleString()}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {showPositionSuggestions && positionSearch && filteredPositions.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center text-sm text-slate-500">
                    No roles match "{positionSearch}"
                  </div>
                )}
              </div>
              {/* Inline benchmark hint */}
              {formData.positionType && BENCHMARKS[formData.positionType] && (
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span>Market: <strong className="text-slate-700">${BENCHMARKS[formData.positionType].p25.toLocaleString()} &ndash; ${BENCHMARKS[formData.positionType].p75.toLocaleString()}</strong></span>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Location <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => { setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }, 200)}
                  onKeyDown={handleLocationKeyDown}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm"
                  placeholder="e.g., Palm Beach, FL or Monaco" />
              </div>
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto custom-scrollbar">
                  {filteredLocationSuggestions.map((loc, idx) => (
                    <button key={idx} type="button"
                      ref={idx === highlightedLocationIndex ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
                      onClick={() => { setFormData({ ...formData, location: loc }); setShowLocationSuggestions(false); setHighlightedLocationIndex(-1); }}
                      onMouseEnter={() => setHighlightedLocationIndex(idx)}
                      className={`w-full text-left px-4 py-2.5 text-sm ${idx === highlightedLocationIndex ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'}`}>
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discretion Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Discretion Level</label>
              <CustomSelect name="discretionLevel" value={formData.discretionLevel} onChange={handleInputChange}
                options={discretionLevels.map(d => ({ value: d.value, label: `${d.label} — ${d.description}` }))} placeholder="Select discretion level" />
            </div>
          </div>
        )}

        {/* Step 2: Budget & Timeline */}
        {step === 2 && (
          <div className="space-y-6 animate-slideInRight">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Budget & Timeline</h3>
              <p className="text-sm text-slate-400">Set your expectations for compensation and timing.</p>
            </div>

            {/* Timeline Cards */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Timeline <span className="text-brand-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timelineOptions.map(opt => {
                  const isSelected = formData.timeline === opt.value;
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setFormData({ ...formData, timeline: opt.value })}
                      className={`p-4 border-2 rounded-xl text-left transition-all duration-200 relative card-interactive ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-sm animate-checkIn">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium text-sm ${isSelected ? 'text-brand-700' : 'text-slate-700'}`}>{opt.label}</span>
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-brand-500' : 'text-slate-300'}`} />
                      </div>
                      <p className={`text-xs ${isSelected ? 'text-brand-500' : 'text-slate-400'}`}>{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget Range <span className="text-brand-500">*</span>
              </label>
              <CustomSelect name="budgetRange" value={formData.budgetRange} onChange={handleInputChange}
                options={budgetRanges} placeholder="Select budget range" />
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className={`p-3.5 rounded-xl flex items-start gap-3 text-sm ${
                    w.type === 'critical' ? 'bg-b-pink-50 border border-b-pink-200' :
                    w.type === 'warning' ? 'bg-b-ocre-50 border border-b-ocre-200' :
                    'bg-brand-50 border border-brand-100'
                  }`}>
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      w.type === 'critical' ? 'text-b-pink-500' :
                      w.type === 'warning' ? 'text-b-ocre-500' :
                      'text-brand-500'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        w.type === 'critical' ? 'text-b-pink-600' :
                        w.type === 'warning' ? 'text-b-ocre-500' :
                        'text-brand-600'
                      }`}>{w.message}</p>
                      {w.suggestion && <p className="text-xs mt-1 text-slate-500">{w.suggestion}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Requirements — Streamlined */}
        {step === 3 && (
          <div className="space-y-6 animate-slideInRight">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Key Requirements</h3>
              <p className="text-sm text-slate-400">Add specifics that matter most — the more detail, the better your analysis.</p>
            </div>

            {/* Additional Requirements (moved to top — most important field per Norman's "make primary action obvious") */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe the ideal candidate <span className="text-brand-500">*</span>
              </label>
              <textarea name="keyRequirements" value={formData.keyRequirements} onChange={handleInputChange} rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm resize-none"
                placeholder="e.g., 10+ years managing UHNW estates, fluent in French, discreet with high-profile families..." />
              <div className="flex items-center justify-between mt-1.5">
                <p className={`text-xs ${formData.keyRequirements.length >= 25 ? 'text-b-opal-500' : 'text-slate-400'}`}>
                  {formData.keyRequirements.length >= 25 ? 'Looking good' : `${25 - formData.keyRequirements.length} more characters for best results`}
                </p>
                <div className="h-1 w-16 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{
                    width: `${Math.min(100, (formData.keyRequirements.length / 25) * 100)}%`,
                    backgroundColor: formData.keyRequirements.length >= 25 ? '#5f9488' : '#94a3b8'
                  }} />
                </div>
              </div>
            </div>

            {/* Certifications — Compact pills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {isCorporateRole ? 'Professional Certifications' : 'Certifications'}
                <span className="text-xs text-slate-400 ml-1.5">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).slice(0, showAllCerts ? undefined : 6).map(cert => (
                  <button key={cert} type="button" onClick={() => handleMultiSelect('certifications', cert)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      formData.certifications.includes(cert)
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}>
                    {cert}
                  </button>
                ))}
              </div>
              {(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length > 6 && (
                <button type="button" onClick={() => setShowAllCerts(!showAllCerts)}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  {showAllCerts ? 'Show less' : `+ ${(isCorporateRole ? corporateCertificationOptions : householdCertificationOptions).length - 6} more`}
                </button>
              )}
            </div>

            {/* Languages — Collapsible for corporate, inline for household */}
            {isCorporateRole ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <button type="button" onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center justify-between w-full text-left p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">Language Requirements</span>
                    <span className="text-xs text-slate-400">(optional)</span>
                    {formData.languageRequirements.length > 0 && !showLanguages && (
                      <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{formData.languageRequirements.length} selected</span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showLanguages ? 'rotate-180' : ''}`} />
                </button>
                {showLanguages && (
                  <div className="px-3.5 pb-3.5 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 pt-3">
                      {corporateLanguageShortList.slice(0, showAllLangs ? undefined : 8).map(lang => (
                        <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            formData.languageRequirements.includes(lang)
                              ? 'bg-brand-500 text-white shadow-sm'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                    {corporateLanguageShortList.length > 8 && (
                      <button type="button" onClick={() => setShowAllLangs(!showAllLangs)}
                        className="mt-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        {showAllLangs ? 'Show less' : `+ ${corporateLanguageShortList.length - 8} more`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Language Requirements
                  <span className="text-xs text-slate-400 ml-1.5">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {householdLanguageOptions.slice(0, showAllLangs ? undefined : 8).map(lang => (
                    <button key={lang} type="button" onClick={() => handleMultiSelect('languageRequirements', lang)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        formData.languageRequirements.includes(lang)
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}>
                      {lang}
                    </button>
                  ))}
                </div>
                {householdLanguageOptions.length > 8 && (
                  <button type="button" onClick={() => setShowAllLangs(!showAllLangs)}
                    className="mt-2 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    {showAllLangs ? 'Show less' : `+ ${householdLanguageOptions.length - 8} more`}
                  </button>
                )}
              </div>
            )}

            {/* Travel */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Travel Requirements</label>
              <CustomSelect name="travelRequirement" value={formData.travelRequirement} onChange={handleInputChange}
                options={travelOptions} placeholder="Select travel requirement" />
            </div>
          </div>
        )}

        {/* Step 4: Finalize */}
        {step === 4 && (
          <div className="space-y-6 animate-slideInRight">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Almost there</h3>
              <p className="text-sm text-slate-400">A few final details to sharpen your analysis.</p>
            </div>

            {/* Summary of what they'll get */}
            <div className="rounded-xl p-4 border border-brand-100" style={{ backgroundColor: '#2814ff08' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#2814ff15' }}>
                  <Zap className="w-4 h-4" style={{ color: '#2814ff' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">Your report will include</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Salary benchmarks, search complexity score, sourcing strategy, candidate availability, and market positioning — all tailored to your specific search.</p>
                </div>
              </div>
            </div>

            {/* Contextual fields */}
            {isCorporateRole ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assets Under Management</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5 text-slate-400" />Vessel Length (LOA)</span>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Crew Size</label>
                  <CustomSelect name="crewSize" value={formData.crewSize} onChange={handleInputChange}
                    options={[
                      { value: '1-5', label: '1 - 5' },
                      { value: '6-12', label: '6 - 12' },
                      { value: '13-20', label: '13 - 20' },
                      { value: '21-plus', label: '21+' },
                    ]} placeholder="Select..." />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Error */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl flex items-center gap-2 bg-b-pink-50 border border-b-pink-200">
            <AlertCircle className="w-4 h-4 text-b-pink-500 flex-shrink-0" />
            <p className="text-sm font-medium text-b-pink-600">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200">
              Back
            </button>
          ) : <div />}

          <button onClick={step === 4 ? calculateComplexity : nextStep} disabled={loading}
            className="text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-brand-500/20 disabled:opacity-70 transition-all duration-200"
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
