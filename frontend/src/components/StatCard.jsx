import '../styles/components/StatCard.css';

export default function StatCard({ title, value, trend, trendLabel, icon: Icon, variant = 'blue' }) {
  const trendDir = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const trendSign = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__header">
        <div className="stat-card__icon">
          {Icon && <Icon size={24} />}
        </div>
        <span className="stat-card__title">{title}</span>
      </div>

      <div className="stat-card__value">{value}</div>

      {trendLabel && (
        <span className={`stat-card__trend stat-card__trend--${trendDir}`}>
          {trendSign} {Math.abs(trend)}% {trendLabel}
        </span>
      )}
    </div>
  );
}
