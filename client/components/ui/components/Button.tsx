import { Icon } from "@/components/ui/components/Icon";
type Variant = "primary" | "secondary" | "ghost" | "social";

type Props = {
  variant?: Variant;
  icon?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md shadow-md active:scale-[0.98]",
  secondary:
    "bg-surface border border-border text-text-primary hover:bg-surface-secondary cursor-pointer",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-secondary cursor-pointer",
  social:
    "bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg shadow-sm",
};

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {icon && (
        <Icon size={variant === "social" ? "sm" : "md"}>
          {icon}
        </Icon>
      )}
    </button>
  );
}
