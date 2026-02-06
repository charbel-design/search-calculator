import React from 'react';
import { GitCompare } from 'lucide-react';
import { BENCHMARKS, CATEGORY_GROUPS } from '../salaryData';

export function RoleComparison({ comparisonRoles, toggleComparisonRole, positionsByCategory }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold" style={{ color: '#2814ff' }}>Compare Roles Side-by-Side</h3>
        <span className="text-sm text-slate-500">{comparisonRoles.length}/3 selected</span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select up to 3 roles to compare</label>
        <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-1">
          {Object.entries(CATEGORY_GROUPS).map(([groupName, categories]) => (
            <div key={groupName}>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2 px-2">{groupName}</div>
              {categories.map(category => (
                <div key={category}>
                  <div className="text-xs font-semibold text-slate-600 py-1 px-2">{category.replace('Family Office - ', '')}</div>
                  {positionsByCategory[category]?.map(pos => (
                    <button
                      key={pos.name}
                      onClick={() => toggleComparisonRole(pos.name)}
                      disabled={!comparisonRoles.includes(pos.name) && comparisonRoles.length >= 3}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        comparisonRoles.includes(pos.name)
                          ? 'bg-brand-100 text-brand-600 font-medium'
                          : comparisonRoles.length >= 3
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pos.name}
                      {comparisonRoles.includes(pos.name) && <span className="float-right text-brand-500">✓</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {comparisonRoles.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 pr-4 text-slate-500 font-medium">Metric</th>
                {comparisonRoles.map(role => (
                  <th key={role} className="text-center py-3 px-2 font-semibold" style={{ color: '#2814ff' }}>{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Salary (25th)</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2">{b ? `$${Math.round(b.p25/1000)}k` : 'N/A'}</td>;
                })}
              </tr>
              <tr className="border-b border-slate-100 bg-brand-50/50">
                <td className="py-3 pr-4 font-medium text-slate-700">Salary (Median)</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2 font-semibold" style={{ color: '#2814ff' }}>{b ? `$${Math.round(b.p50/1000)}k` : 'N/A'}</td>;
                })}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Salary (75th)</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2">{b ? `$${Math.round(b.p75/1000)}k` : 'N/A'}</td>;
                })}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Scarcity</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  const s = b?.scarcity || 5;
                  return <td key={role} className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s >= 7 ? 'bg-b-pink-100 text-b-pink-500' : s >= 5 ? 'bg-b-ocre-100 text-b-ocre-500' : 'bg-b-opal-100 text-b-opal-600'}`}>
                      {s}/10
                    </span>
                  </td>;
                })}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Housing</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.housing || 'N/A'}</td>;
                })}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Vehicle</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.vehicle || 'N/A'}</td>;
                })}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 pr-4 font-medium text-slate-700">Health</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.health || 'N/A'}</td>;
                })}
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-slate-700">Bonus</td>
                {comparisonRoles.map(role => {
                  const b = BENCHMARKS[role];
                  return <td key={role} className="text-center py-3 px-2 text-xs">{b?.benefits?.bonus || 'N/A'}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {comparisonRoles.length < 2 && (
        <div className="text-center py-8 text-slate-400">
          <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select at least 2 roles to see the comparison</p>
        </div>
      )}
    </div>
  );
}
