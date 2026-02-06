import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

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
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-left flex items-center justify-between bg-white text-sm ${
          open ? 'border-brand-500 ring-2 ring-brand-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'
        }`}>
        <span className={selected ? 'text-slate-900' : 'text-slate-400'}>{selected ? selected.label : (placeholder || 'Select...')}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto custom-scrollbar">
          {options.map((opt, idx) => (
            <button key={opt.value} type="button"
              ref={idx === highlighted ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
              onClick={() => { onChange({ target: { name, value: opt.value } }); setOpen(false); }}
              onMouseEnter={() => setHighlighted(idx)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${
                idx === highlighted ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50 text-slate-700'
              } ${opt.value === value ? 'font-medium' : ''}`}>
              <span>{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 text-brand-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
