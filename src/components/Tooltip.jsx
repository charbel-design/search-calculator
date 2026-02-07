import React, { useState } from 'react';

export function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {children}
      </div>
      {visible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-white shadow-elevated text-xs rounded-btn whitespace-nowrap z-50"
          style={{ color: '#1d1d1f' }}>
          {text}
        </div>
      )}
    </div>
  );
}
