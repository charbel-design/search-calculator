import React from 'react';
import { X, CheckCircle, Copy, Mail, RefreshCw, Link2 } from 'lucide-react';

export function ShareModal({ visible, shareUrl, copiedShare, copyShareUrl, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={onClose}>
      <div className="bg-white rounded-card shadow-elevated p-6 max-w-md w-full animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-base" style={{ color: '#1d1d1f' }}>Share This Analysis</h4>
          <button onClick={onClose} className="w-8 h-8 rounded-btn flex items-center justify-center hover:opacity-75 transition-opacity">
            <X className="w-4 h-4" style={{ color: '#a1a1a6' }} />
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6e6e73' }}>Share this link — recipients will see your search details and analysis.</p>
        <div className="flex gap-2">
          <input type="text" readOnly value={shareUrl}
            className="flex-1 px-3 py-2.5 border rounded-btn text-sm truncate" style={{ borderColor: '#d2d2d7', backgroundColor: '#f5f5f3', color: '#6e6e73' }} />
          <button onClick={copyShareUrl}
            className="px-4 py-2.5 rounded-btn text-sm font-medium flex items-center gap-2 transition-opacity hover:opacity-88 text-white"
            style={{ backgroundColor: copiedShare ? '#5f9488' : '#2814ff' }}>
            {copiedShare ? <><CheckCircle className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: '#a1a1a6' }}>Your personal details stay private.</p>
      </div>
    </div>
  );
}

export function EmailModal({ visible, emailForReport, setEmailForReport, handleSendEmail, sendingEmail, emailSent, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={onClose}>
      <div className="bg-white rounded-card shadow-elevated p-6 max-w-md w-full animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-base" style={{ color: '#1d1d1f' }}>Email This Report</h4>
          <button onClick={onClose} className="w-8 h-8 rounded-btn flex items-center justify-center hover:opacity-75 transition-opacity">
            <X className="w-4 h-4" style={{ color: '#a1a1a6' }} />
          </button>
        </div>
        {emailSent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#f0f7f5' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#5f9488' }} />
            </div>
            <p className="font-semibold" style={{ color: '#1d1d1f' }}>Report sent!</p>
            <p className="text-sm mt-1" style={{ color: '#6e6e73' }}>Check your inbox for the analysis report.</p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4" style={{ color: '#6e6e73' }}>We'll send you a clean, shareable report with the full analysis.</p>
            <input type="email" value={emailForReport} onChange={(e) => setEmailForReport(e.target.value)}
              className="w-full px-4 py-3 border rounded-btn mb-3 text-sm transition-colors duration-200"
              style={{ borderColor: '#d2d2d7' }}
              onFocus={(e) => e.target.style.borderColor = '#2814ff'}
              onBlur={(e) => e.target.style.borderColor = '#d2d2d7'}
              placeholder="your@email.com" />
            <button onClick={handleSendEmail} disabled={sendingEmail || !emailForReport.includes('@')}
              className="w-full text-white px-4 py-3 rounded-btn font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity hover:opacity-88"
              style={{ backgroundColor: '#2814ff' }}>
              {sendingEmail ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />Sending...</>
              ) : (
                <><Mail className="w-4 h-4" />Send Report</>
              )}
            </button>
            <p className="text-xs mt-2" style={{ color: '#a1a1a6' }}>We'll only use this email to send your report.</p>
          </>
        )}
      </div>
    </div>
  );
}
