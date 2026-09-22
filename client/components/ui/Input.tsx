type Props = {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: "left" | "right";
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  error,
  icon,
  iconPosition = "left",
  className = "",
  ...rest
}: Props) {
  const hasLeftIcon = icon && iconPosition === "left";
  const hasRightContent = icon && iconPosition === "right";

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="font-label-sm text-label-sm text-on-surface">{label}</span>}
      <div className="relative">
        <input
          className={`w-full h-11 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#7c5cfc] transition-all ${hasLeftIcon ? "pl-10" : "px-3.5"} ${hasRightContent ? "pr-10" : "pr-3.5"} ${className}`}
          {...rest}
        />
        {icon && iconPosition === "left" && (
          <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-2.5 select-none pointer-events-none">
            {icon}
          </span>
        )}
        {icon && iconPosition === "right" && (
          <span className="material-symbols-outlined text-lg text-on-surface-variant absolute right-3 top-2.5 select-none pointer-events-none">
            {icon}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
