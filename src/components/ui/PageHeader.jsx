export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="hdx_flex hdx_flex-col hdx_sm_flex-row hdx_sm_items-center hdx_sm_justify-between hdx_gap-4 hdx_mb-6">
      <div>
        <h1 className="hdx_text-page-title hdx_text-ink">{title}</h1>
        {subtitle && <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="hdx_flex hdx_flex-wrap hdx_items-center hdx_gap-2.5">{actions}</div>}
    </div>
  );
}
