import React from 'react';

export function Header({ showRoleComparison, setShowRoleComparison, results }) {
  return (
    <div className={`text-center ${results ? 'mb-4' : 'mb-8'} transition-all duration-300`}>
      <div className="inline-block mb-4">
        <div className={`${results ? 'px-4 py-2' : 'px-6 py-3'} rounded-xl transition-all duration-300`} style={{ backgroundColor: '#2814ff' }}>
          <span className={`text-white ${results ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold tracking-wide transition-all duration-300`} style={{ fontFamily: "'Poppins', sans-serif" }}>talent gurus</span>
        </div>
      </div>
      {!results && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-fadeInUp" style={{ color: '#2814ff', fontFamily: "'Poppins', sans-serif" }}>Search Intelligence Engine</h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto animate-fadeInUp delay-100">Salary benchmarks, sourcing strategy, and market insights — in 90 seconds.</p>
          <p className="mt-3 animate-fadeInUp delay-200">
            <button
              onClick={() => setShowRoleComparison(!showRoleComparison)}
              className="text-xs text-slate-400 hover:text-brand-500 transition-colors"
            >
              {showRoleComparison ? '← Back to calculator' : 'or compare roles side-by-side →'}
            </button>
          </p>
        </>
      )}
      {results && (
        <p className="text-sm text-slate-500">Search Intelligence Engine</p>
      )}
    </div>
  );
}
