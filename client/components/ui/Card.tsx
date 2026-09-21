type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className = "", children }: Props) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: Props) {
  return (
    <h2 className="text-base font-semibold leading-6 text-text-primary">
      {children}
    </h2>
  );
}
