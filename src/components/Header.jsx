import React from 'react';
import { GitCompare } from 'lucide-react';

export function Header({ showRoleComparison, setShowRoleComparison, results }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-block mb-6">
        <div className="px-6 py-3 rounded-xl" style={{ backgroundColor: '#2814ff' }}>
          <span className="text-white text-2xl md:text-3xl font-bold tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>talent gurus</span>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#2814ff', fontFamily: "'Playfair Display', serif" }}>Search Intelligence Engine</h2>
      <p className="text-base text-slate-600 max-w-2xl mx-auto">Salary benchmarks, sourcing strategy, and market intelligence — in 90 seconds.</p>

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
  );
}
