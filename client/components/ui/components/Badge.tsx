type Tone = "success" | "accent" | "info" | "warning" | "neutral";

type Props = {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

const toneClasses: Record<Tone, string> = {
  success: "bg-success-lightest text-success-foreground",
  accent: "bg-accent-muted text-accent",
  info: "bg-info-lightest text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  neutral: "bg-surface-secondary text-text-secondary",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
