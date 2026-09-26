import { Icon } from "@/components/ui/components/Icon";
type Props = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  layout?: "default" | "split";
  brandPanel?: React.ReactNode;
};

export function AuthCard({
  title,
  subtitle,
  className = "",
  children,
  layout = "default",
  brandPanel,
}: Props) {
  const isSplit = layout === "split";

  return (
    <div className={`w-full ${isSplit ? "max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12" : "max-w-md mx-auto px-6 py-12"} ${className}`}>
      {isSplit ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {brandPanel && (
            <div className="lg:col-span-6 hidden lg:flex flex-col justify-between relative overflow-hidden rounded-xl bg-surface-container-low p-8 lg:p-12 shadow-sm min-h-[640px]">
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary-fixed/50 blur-3xl pointer-events-none" />
              {brandPanel}
            </div>
          )}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="max-w-[480px] mx-auto bg-surface-container-lowest rounded-xl p-8 lg:p-10 shadow-sm">
              {title && (
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface">{title}</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      v4.8 Portal
                    </span>
                  </div>
                  {subtitle && (
                    <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto flex flex-col relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl p-5">
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-primary-fixed/20 pointer-events-none blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-secondary-fixed/30 pointer-events-none blur-2xl" />
          <div className="flex flex-col items-center text-center mb-5 relative z-10">
            <div className="w-16 h-16 rounded-xl bg-surface-container-low shadow-sm flex items-center justify-center p-2 mb-3 transition-transform active:scale-95 duration-200">
              <div className="w-full h-full rounded-lg bg-logo-gradient flex items-center justify-center">
                <Icon size="lg" className="text-white">token</Icon>
              </div>
            </div>
            {title && <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">{title}</h1>}
            {subtitle && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{subtitle}</p>}
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
