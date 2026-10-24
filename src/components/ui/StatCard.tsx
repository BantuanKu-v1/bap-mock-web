type StatCardProps = {
  label: string;
  value: number;
  variant?: string;
};

export default function StatCard({
  label,
  value,
  variant = "default"
}: StatCardProps) {
  return (
      <div className={`stat-card stat-card--${variant}`}>
        <span className="stat-card__label">
          {label}
        </span>

        <span className="stat-card__value">
          {value}
        </span>
      </div>
  );
}
