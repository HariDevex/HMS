import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, iconBg, label, value, trend, trendDir = 'up', hint, sparkline }) {
  const positive = trendDir === 'up';
  return (
    <div className="card p-5 transition-shadow duration-150 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${iconBg}`}>
          <Icon size={21} className="text-white" />
        </div>
        {sparkline && (
          <svg width="64" height="32" className="text-primary opacity-70" aria-hidden="true">
            <polyline
              points={sparkline}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <p className="mt-4 text-stat-number text-ink">{value}</p>
      <p className="text-body font-medium text-ink-secondary mt-0.5">{label}</p>
      <div className="flex items-center gap-1.5 mt-3">
        <span
          className={`inline-flex items-center gap-0.5 text-small font-semibold ${
            positive ? 'text-success' : 'text-error'
          }`}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trend}
        </span>
        <span className="text-small text-ink-secondary">{hint}</span>
      </div>
    </div>
  );
}
