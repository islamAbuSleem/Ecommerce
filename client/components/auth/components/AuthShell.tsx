import { AuthCard } from "./AuthCard";
import { BrandPanel } from "./BrandPanel";
import { AuthTabs } from "./AuthTabs";
import { SocialButtons } from "./SocialButtons";
import { AuthDivider } from "./AuthDivider";
import { ArtisanBanner } from "./ArtisanBanner";
import { EncryptionNote } from "./EncryptionNote";

export type AuthMode = "login" | "register";

export type BrandCopy = {
  headline: string;
  subcopy: string;
  quote: string;
  name: string;
  shop: string;
};

export type ModeCopy = {
  title: string;
  subtitle: string;
};

type AuthShellProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  brand: BrandCopy;
  titles: Record<AuthMode, ModeCopy>;
  helper: React.ReactNode;
  apiUrl: string;
  children: React.ReactNode;
};

export function AuthShell({ mode, onModeChange, brand, titles, helper, apiUrl, children }: AuthShellProps) {
  const copy = titles[mode];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthCard layout="split" brandPanel={<BrandPanel brand={brand} />}>
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-headline-md text-on-surface">{copy.title}</span>
            <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-label-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              v4.8 Portal
            </span>
          </div>
          <p className="text-body-md text-on-surface-variant">{copy.subtitle}</p>
        </div>

        <AuthTabs mode={mode} onModeChange={onModeChange} />
        <SocialButtons apiUrl={apiUrl} />
        <AuthDivider />

        {children}

        <div className="mt-6 text-center">
          <p className="text-body-sm text-on-surface-variant">{helper}</p>
        </div>

        <ArtisanBanner />
        <EncryptionNote />
      </AuthCard>
    </div>
  );
}
