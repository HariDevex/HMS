import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction,
  compact = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'p-4' : 'p-8 sm:p-12'} ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction} variant="secondary">
          {actionText}
        </Button>
      )}
    </div>
  );
}
