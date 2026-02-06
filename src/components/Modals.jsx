import React from 'react';
import { X, CheckCircle, Copy, Mail, RefreshCw } from 'lucide-react';

export function ShareModal({ visible, shareUrl, copiedShare, copyShareUrl, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Share This Analysis</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-slate-600 mb-4">Share this link with anyone — they'll see your search parameters and complexity analysis.</p>
        <div className="flex gap-2">
          <input type="text" readOnly value={shareUrl} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 truncate" />
          <button onClick={copyShareUrl} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
            style={{ backgroundColor: copiedShare ? '#99c1b9' : '#2814ff', color: '#ffffff' }}>
            {copiedShare ? <><CheckCircle className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">Recipients will see deterministic analysis. No AI insights or personal data is shared.</p>
      </div>
    </div>
  );
}

export function EmailModal({ visible, emailForReport, setEmailForReport, handleSendEmail, sendingEmail, emailSent, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg" style={{ color: '#2814ff' }}>Email This Report</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {emailSent ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-b-opal-400 mx-auto mb-3" />
            <p className="font-semibold text-b-opal-600">Report sent!</p>
            <p className="text-sm text-slate-500 mt-1">Check your inbox for the analysis report.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-4">We'll send a formatted report with your complete analysis.</p>
            <input type="email" value={emailForReport} onChange={(e) => setEmailForReport(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="your@email.com" />
            <button onClick={handleSendEmail} disabled={sendingEmail || !emailForReport.includes('@')}
              className="w-full text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#2814ff' }}>
              {sendingEmail ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />Sending...</>
              ) : (
                <><Mail className="w-4 h-4" />Send Report</>
              )}
            </button>
            <p className="text-xs text-slate-400 mt-2">We'll only use this email to send your report.</p>
          </>
        )}
      </div>
    </div>
  );
}
