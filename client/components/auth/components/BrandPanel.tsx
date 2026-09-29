import Link from "next/link";
import type { BrandCopy } from "./AuthShell";
import { FeatureGrid } from "./FeatureGrid";
import { Icon } from "@/components/ui/components/Icon";

export function BrandPanel({ brand }: { brand: BrandCopy }) {
  return (
    <>
      <div className="relative z-10 flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-on-primary shadow-sm">
            <Icon size="md">token</Icon>
          </span>
          <div className="flex flex-col">
            <span className="text-headline-sm text-on-surface tracking-tight">Aura Commerce</span>
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">Provenance Protocol</span>
          </div>
        </Link>
        <div className="flex flex-col gap-4 mt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary w-fit">
            <Icon size="xs" filled>verified</Icon>
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
              <Icon size="xl" className="text-primary">auto_stories</Icon>
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
