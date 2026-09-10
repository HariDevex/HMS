import React from 'react';
import { Loader2 } from 'lucide-react';

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="px-4 py-4">
          <div className="h-4 bg-slate-200/80 rounded animate-pulse w-full max-w-[85%]" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-20" />
      <div className="h-3 bg-slate-200 rounded w-36 pt-2" />
    </div>
  );
}

export default function LoadingState({ message = 'Loading records...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
