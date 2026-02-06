import React from 'react';
import { X, CheckCircle, Copy, Mail, RefreshCw, Link2 } from 'lucide-react';

export function ShareModal({ visible, shareUrl, copiedShare, copyShareUrl, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2814ff10' }}>
              <Link2 className="w-4 h-4" style={{ color: '#2814ff' }} />
            </div>
            <h4 className="font-semibold text-base text-slate-900">Share This Analysis</h4>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-4">Share this link — recipients will see your search details and analysis.</p>
        <div className="flex gap-2">
          <input type="text" readOnly value={shareUrl}
            className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 truncate text-slate-600" />
          <button onClick={copyShareUrl}
            className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all text-white"
            style={{ backgroundColor: copiedShare ? '#5f9488' : '#2814ff' }}>
            {copiedShare ? <><CheckCircle className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">Your personal details stay private.</p>
      </div>
    </div>
  );
}

export function EmailModal({ visible, emailForReport, setEmailForReport, handleSendEmail, sendingEmail, emailSent, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#2814ff10' }}>
              <Mail className="w-4 h-4" style={{ color: '#2814ff' }} />
            </div>
            <h4 className="font-semibold text-base text-slate-900">Email This Report</h4>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        {emailSent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-b-opal-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-b-opal-500" />
            </div>
            <p className="font-semibold text-slate-900">Report sent!</p>
            <p className="text-sm text-slate-500 mt-1">Check your inbox for the analysis report.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">We'll send you a clean, shareable report with the full analysis.</p>
            <input type="email" value={emailForReport} onChange={(e) => setEmailForReport(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm"
              placeholder="your@email.com" />
            <button onClick={handleSendEmail} disabled={sendingEmail || !emailForReport.includes('@')}
              className="w-full text-white px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
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
