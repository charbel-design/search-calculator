import React from 'react';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ value, onChange, options, placeholder, name }) {
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(-1);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => { if (!open) setHighlighted(-1); }, [open]);

  const selected = options.find(o => o.value === value);

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(prev => prev < options.length - 1 ? prev + 1 : prev); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(prev => prev > 0 ? prev - 1 : prev); }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); onChange({ target: { name, value: options[highlighted].value } }); setOpen(false); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:shadow-md focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-left flex items-center justify-between bg-white">
        <span className={selected ? 'text-slate-900' : 'text-slate-400'}>{selected ? selected.label : (placeholder || 'Select...')}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-brand-50 border border-brand-100 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {options.map((opt, idx) => (
            <button key={opt.value} type="button"
              ref={idx === highlighted ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
              onClick={() => { onChange({ target: { name, value: opt.value } }); setOpen(false); }}
              onMouseEnter={() => setHighlighted(idx)}
              className={`w-full text-left px-4 py-2.5 text-sm ${
                opt.value === value ? 'font-semibold text-brand-700' : ''
              } ${idx === highlighted ? 'bg-brand-200 text-brand-700' : 'hover:bg-brand-100 text-slate-700'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
