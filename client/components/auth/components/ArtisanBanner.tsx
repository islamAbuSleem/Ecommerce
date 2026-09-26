import Link from "next/link";

export function ArtisanBanner() {
  return (
    <div className="mt-8 pt-6 bg-surface-container-low rounded-lg p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl icon-filled">palette</span>
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
