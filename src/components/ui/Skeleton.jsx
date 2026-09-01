export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:400px_100%] ${className}`}
    />
  );
}
