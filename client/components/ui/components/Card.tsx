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
