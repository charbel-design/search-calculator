import React from 'react';
import { Sparkles, ArrowLeftRight } from 'lucide-react';

export function Header({ showRoleComparison, setShowRoleComparison, results }) {
  return (
    <div className={`text-center ${results ? 'mb-4' : 'mb-10'} transition-all duration-500`}>
      {/* Logo */}
      <div className="inline-block mb-5">
        <div
          className={`${results ? 'px-4 py-2' : 'px-7 py-3'} rounded-2xl transition-all duration-500 relative overflow-hidden group`}
          style={{ backgroundColor: '#2814ff' }}
        >
          {/* Subtle shimmer effect on hover */}
          {!results && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
          <span
            className={`text-white ${results ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold tracking-wider transition-all duration-500 relative z-10`}
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '0.08em' }}
          >
            talent gurus
          </span>
        </div>
      </div>

      {!results && (
        <div className="space-y-4">
          {/* Main headline */}
          <h2
            className="text-3xl md:text-4xl font-bold animate-fadeInUp tracking-tight"
            style={{ color: '#1a1a2e', fontFamily: "'Poppins', sans-serif" }}
          >
            Search Intelligence Engine
          </h2>

          {/* Subtitle with refined styling */}
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto animate-fadeInUp delay-100 leading-relaxed">
            Salary benchmarks, sourcing strategy, and market insights
            <span className="hidden md:inline"> — </span>
            <span className="block md:inline mt-1 md:mt-0">
              powered by real UHNW placement data.
            </span>
          </p>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-3 animate-fadeInUp delay-200 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100">
              <Sparkles className="w-3 h-3" />
              AI-Powered Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
              90-Second Reports
            </span>
          </div>

          {/* Compare toggle */}
          <p className="animate-fadeInUp delay-300 pt-1">
            <button
              onClick={() => setShowRoleComparison(!showRoleComparison)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-500 transition-all duration-200 hover:gap-2"
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
        <p className="text-sm text-slate-400 font-medium tracking-wide">Search Intelligence Engine</p>
      )}
    </div>
  );
}
