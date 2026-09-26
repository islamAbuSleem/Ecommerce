type SocialButtonProps = {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SocialButton({ children, className = "", ...rest }: SocialButtonProps) {
  return (
    <button
      className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm ${className}`}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
