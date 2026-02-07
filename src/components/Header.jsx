import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

export function Header({ showRoleComparison, setShowRoleComparison, results }) {
  return (
    <div className={`text-center ${results ? 'mb-4' : 'mb-10'} transition-all duration-300`}>
      {/* Logo */}
      <div className="inline-block mb-5">
        <div
          className={`${results ? 'px-4 py-2' : 'px-7 py-3'} rounded-btn transition-all duration-300`}
          style={{ backgroundColor: '#2814ff' }}
        >
          <span
            className={`text-white ${results ? 'text-lg' : 'text-2xl md:text-3xl'} font-semibold tracking-wider transition-all duration-300`}
            style={{ letterSpacing: '0.08em' }}
          >
            talent gurus
          </span>
        </div>
      </div>

      {!results && (
        <div className="space-y-4">
          {/* Main headline */}
          <h2
            className="text-3xl md:text-4xl font-semibold animate-fadeInUp tracking-tight"
            style={{ color: '#1d1d1f' }}
          >
            Search Intelligence Engine
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg max-w-xl mx-auto animate-fadeInUp delay-100 leading-relaxed" style={{ color: '#6e6e73' }}>
            Salary benchmarks, sourcing strategy, and market insights
            <span className="hidden md:inline"> — </span>
            <span className="block md:inline mt-1 md:mt-0">
              powered by real UHNW placement data.
            </span>
          </p>

          {/* Compare toggle */}
          <p className="animate-fadeInUp delay-200 pt-1">
            <button
              onClick={() => setShowRoleComparison(!showRoleComparison)}
              className="inline-flex items-center gap-1.5 text-xs transition-all duration-200 hover:opacity-75"
              style={{ color: '#a1a1a6' }}
            >
              {showRoleComparison ? (
                '← Back to calculator'
              ) : (
                <>
                  <ArrowLeftRight className="w-3 h-3" />
                  Compare roles side-by-side
                </>
              )}
            </button>
          </p>
        </div>
      )}

      {results && (
        <p className="text-sm font-medium tracking-wide" style={{ color: '#a1a1a6' }}>Search Intelligence Engine</p>
      )}
    </div>
  );
}
