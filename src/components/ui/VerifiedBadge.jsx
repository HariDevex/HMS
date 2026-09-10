import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

export default function VerifiedBadge({
  verifiedBy,
  verifiedAt,
  title = 'Verified Clinical Record',
  className = '',
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-tight text-emerald-900 uppercase">
            {title}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700/80 bg-emerald-100/70 px-1.5 py-0.2 rounded">
            <Lock className="w-2.5 h-2.5" /> Read-Only
          </span>
        </div>
        {(verifiedBy || verifiedAt) && (
          <p className="text-[11px] text-emerald-700 font-medium">
            {verifiedBy && <span>Verified by {verifiedBy}</span>}
            {verifiedAt && <span> • {verifiedAt}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
