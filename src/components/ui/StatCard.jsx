import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'up',
  icon: Icon,
  iconBg = 'bg-blue-50 text-primary',
  className = '',
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      hover={Boolean(onClick)}
      className={`p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {trend && (
            <div className={`flex items-center gap-1 font-semibold ${
              trendType === 'up' ? 'text-green-600' : trendType === 'down' ? 'text-red-600' : 'text-slate-600'
            }`}>
              {trendType === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendType === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend}</span>
            </div>
          )}
          {subtitle && <span className="truncate">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
