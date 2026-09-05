import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, iconBg, label, value, trend, trendDir = 'up', hint, sparkline }) {
  const positive = trendDir === 'up';
  return (
    <div className="card hdx_p-5 hdx_transition-shadow hdx_duration-150 hdx_hover_shadow-card-hover">
      <div className="hdx_flex hdx_items-start hdx_justify-between">
        <div className={`hdx_w-11 hdx_h-11 hdx_rounded-10 hdx_flex hdx_items-center hdx_justify-center ${iconBg}`}>
          <Icon size={21} className="hdx_text-white" />
        </div>
        {sparkline && (
          <svg width="64" height="32" className="hdx_text-primary hdx_opacity-70" aria-hidden="true">
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
      <p className="hdx_mt-4 hdx_text-stat-number hdx_text-ink">{value}</p>
      <p className="hdx_text-body hdx_font-medium hdx_text-ink-secondary hdx_mt-0.5">{label}</p>
      <div className="hdx_flex hdx_items-center hdx_gap-1.5 hdx_mt-3">
        <span
          className={`hdx_inline-flex hdx_items-center hdx_gap-0.5 hdx_text-small hdx_font-semibold ${
            positive ? 'hdx_text-success' : 'hdx_text-error'
          }`}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {trend}
        </span>
        <span className="hdx_text-small hdx_text-ink-secondary">{hint}</span>
      </div>
    </div>
  );
}
