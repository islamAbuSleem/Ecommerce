import Link from "next/link";
import { AuthCard } from "@/components/ui/AuthCard";
import { SocialButtons } from "./SocialButtons";

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

const MODES: { id: AuthMode; label: string }[] = [
  { id: "login", label: "Sign In" },
  { id: "register", label: "Create Account" },
];

const FEATURES = [
  {
    icon: "shield",
    title: "100% Escrow",
    caption: "Protected multi-tier patron vaults",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: "account_balance",
    title: "Direct Studio",
    caption: "Frictionless disbursement on receipt",
    tint: "bg-secondary/10 text-secondary",
  },
  {
    icon: "workspace_premium",
    title: "Verified Origin",
    caption: "Authentic benchcraft lineage record",
    tint: "bg-tertiary-container/10 text-tertiary",
  },
];

function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FEATURES.map(({ icon, title, caption, tint }) => (
        <div key={title} className="flex flex-col gap-2 p-3.5 rounded-lg bg-surface-container-lowest shadow-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tint}`}>
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
          <span className="text-label-md text-on-surface">{title}</span>
          <span className="text-caption text-on-surface-variant">{caption}</span>
        </div>
      ))}
    </div>
  );
}

function BrandPanel({ brand }: { brand: BrandCopy }) {
  return (
    <>
      <div className="relative z-10 flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-xl">token</span>
          </span>
          <div className="flex flex-col">
            <span className="text-headline-sm text-on-surface tracking-tight">Aura Commerce</span>
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">Provenance Protocol</span>
          </div>
        </Link>
        <div className="flex flex-col gap-4 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary w-fit">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-label-sm font-semibold tracking-wide uppercase">Curation Collective</span>
          </div>
          <h1 className="text-display-lg text-on-surface tracking-tight">
            {brand.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            {brand.subcopy}
          </p>
        </div>
        <div className="relative rounded-xl overflow-hidden bg-surface shadow-sm p-5 mt-2">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">auto_stories</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-body-md text-on-surface italic leading-snug">
                &ldquo;{brand.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-label-md text-on-surface font-semibold truncate">{brand.name}</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant" />
                <span className="text-caption text-primary">{brand.shop}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 pt-8 mt-8">
        <FeatureGrid />
      </div>
    </>
  );
}

function AuthTabs({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
  return (
    <div className="flex p-1 mb-6 rounded-lg bg-surface-container-high" role="tablist">
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          aria-selected={mode === id}
          className={`flex-1 py-2 text-center rounded-md text-label-md transition-all duration-200 ${
            mode === id
              ? "bg-surface-container-lowest text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
          onClick={() => onModeChange(id)}
          role="tab"
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function AuthDivider() {
  return (
    <div className="relative flex py-2 items-center mb-6">
      <div className="flex-grow h-px bg-surface-container-highest" />
      <span className="shrink-0 px-3 text-caption text-on-surface-variant uppercase tracking-wider">
        or continue with email
      </span>
      <div className="flex-grow h-px bg-surface-container-highest" />
    </div>
  );
}

function ArtisanBanner() {
  return (
    <div className="mt-8 pt-6 bg-surface-container-low rounded-lg p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
        <div className="flex flex-col">
          <span className="text-label-md text-on-surface">Are you a master craftsperson?</span>
          <span className="text-caption text-on-surface-variant">Access studio registry and direct provenance vaults</span>
        </div>
      </div>
      <Link href="#artisan-apply" className="text-label-sm font-semibold text-primary hover:text-primary-container shrink-0 flex items-center gap-0.5">
        <span>Apply</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </Link>
    </div>
  );
}

function EncryptionNote() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant opacity-80">
      <span className="material-symbols-outlined text-sm">lock</span>
      <span className="text-caption">Protected by 256-bit bank-grade encryption &amp; Stripe Identity</span>
    </div>
  );
}

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
