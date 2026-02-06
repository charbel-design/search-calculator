import React, { useState } from 'react';
import { useSearchEngine } from './components/useSearchEngine';
import { Header } from './components/Header';
import { RoleComparison } from './components/RoleComparison';
import { FormSteps } from './components/FormSteps';
import { ResultsView } from './components/ResultsView';
import { APP_VERSION } from './components/constants';

const SearchIntelligenceEngine = () => {
  const engine = useSearchEngine();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header showRoleComparison={engine.showRoleComparison} setShowRoleComparison={engine.setShowRoleComparison} results={engine.results} />

        {/* Role Comparison Panel */}
        {engine.showRoleComparison && !engine.results && (
          <RoleComparison comparisonRoles={engine.comparisonRoles} toggleComparisonRole={engine.toggleComparisonRole} positionsByCategory={engine.positionsByCategory} />
        )}

        {/* Form or Results */}
        {!engine.results && !engine.showRoleComparison ? (
          <FormSteps
            step={engine.step}
            setStep={engine.setStep}
            formData={engine.formData}
            setFormData={engine.setFormData}
            loading={engine.loading}
            loadingStep={engine.loadingStep}
            error={engine.error}
            setError={engine.setError}
            warnings={engine.warnings}
            positionSearch={engine.positionSearch}
            setPositionSearch={engine.setPositionSearch}
            showPositionSuggestions={engine.showPositionSuggestions}
            setShowPositionSuggestions={engine.setShowPositionSuggestions}
            highlightedPositionIndex={engine.highlightedPositionIndex}
            setHighlightedPositionIndex={engine.setHighlightedPositionIndex}
            filteredPositions={engine.filteredPositions}
            showLocationSuggestions={engine.showLocationSuggestions}
            setShowLocationSuggestions={engine.setShowLocationSuggestions}
            highlightedLocationIndex={engine.highlightedLocationIndex}
            setHighlightedLocationIndex={engine.setHighlightedLocationIndex}
            filteredLocationSuggestions={engine.filteredLocationSuggestions}
            handleInputChange={engine.handleInputChange}
            handleLocationKeyDown={engine.handleLocationKeyDown}
            handleMultiSelect={engine.handleMultiSelect}
            validateAndWarn={engine.validateAndWarn}
            validateStep={engine.validateStep}
            nextStep={engine.nextStep}
            calculateComplexity={engine.calculateComplexity}
            isCorporateRole={engine.isCorporateRole}
            budgetRanges={engine.budgetRanges}
            timelineOptions={engine.timelineOptions}
            discretionLevels={engine.discretionLevels}
            householdLanguageOptions={engine.householdLanguageOptions}
            corporateLanguageOptions={engine.corporateLanguageOptions}
            householdCertificationOptions={engine.householdCertificationOptions}
            corporateCertificationOptions={engine.corporateCertificationOptions}
            travelOptions={engine.travelOptions}
            corporateLanguageShortList={engine.corporateLanguageShortList}
            showLanguages={engine.showLanguages}
            setShowLanguages={engine.setShowLanguages}
            commonRoles={engine.commonRoles}
          />
        ) : engine.results ? (
          <ResultsView
            results={engine.results}
            formData={engine.formData}
            loading={engine.loading}
            compareMode={engine.compareMode}
            setCompareMode={engine.setCompareMode}
            comparisonResults={engine.comparisonResults}
            whatIfMode={engine.whatIfMode}
            setWhatIfMode={engine.setWhatIfMode}
            whatIfBudget={engine.whatIfBudget}
            setWhatIfBudget={engine.setWhatIfBudget}
            whatIfTimeline={engine.whatIfTimeline}
            setWhatIfTimeline={engine.setWhatIfTimeline}
            calculateWhatIfScore={engine.calculateWhatIfScore}
            timelineOptions={engine.timelineOptions}
            budgetRanges={engine.budgetRanges}
            showShareModal={engine.showShareModal}
            setShowShareModal={engine.setShowShareModal}
            shareUrl={engine.shareUrl}
            copiedShare={engine.copiedShare}
            copyShareUrl={engine.copyShareUrl}
            showEmailModal={engine.showEmailModal}
            setShowEmailModal={engine.setShowEmailModal}
            emailForReport={engine.emailForReport}
            setEmailForReport={engine.setEmailForReport}
            handleSendEmail={engine.handleSendEmail}
            sendingEmail={engine.sendingEmail}
            emailSent={engine.emailSent}
            setEmailSent={engine.setEmailSent}
            generateShareUrl={engine.generateShareUrl}
            runComparison={engine.runComparison}
            resetForm={engine.resetForm}
            showLanguages={engine.showLanguages}
            setShowLanguages={engine.setShowLanguages}
            commonRoles={engine.commonRoles}
            calculateComplexity={engine.calculateComplexity}
          />
        ) : null}

        {/* Footer */}
        <footer className="mt-16 pb-4">
          <div className="border-t border-slate-100 pt-6 text-center">
            <p className="font-semibold text-sm tracking-wide" style={{ color: '#2814ff' }}>Talent Gurus</p>
            <p className="text-xs text-slate-400 mt-1">We find the people you'll rely on for years.</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <a href="https://talent-gurus.com" target="_blank" rel="noopener noreferrer"
                className="text-xs hover:underline transition-colors" style={{ color: '#2814ff' }}>
                talent-gurus.com
              </a>
              <span className="text-slate-200">|</span>
              <button onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Disclaimer {showDisclaimer ? '\u25BE' : '\u25B8'}
              </button>
            </div>
            {showDisclaimer && (
              <div className="mt-3 max-w-2xl mx-auto text-xs text-slate-400 animate-fadeInUp leading-relaxed">
                <p className="mb-1.5">This tool provides market intelligence based on aggregated industry data and should not be construed as a guarantee of search outcomes, candidate availability, or compensation accuracy. Every search is unique, and actual results may vary based on market conditions, candidate preferences, and specific role requirements.</p>
                <p>AI Disclosure: Portions of this analysis are generated using AI language models. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. This tool is for informational purposes only and does not constitute professional staffing advice. For personalized guidance, please consult directly with Talent Gurus.</p>
              </div>
            )}
            <p className="text-[10px] text-slate-300 mt-3">{engine.commonRoles.length} positions tracked &middot; v{APP_VERSION}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SearchIntelligenceEngine;
