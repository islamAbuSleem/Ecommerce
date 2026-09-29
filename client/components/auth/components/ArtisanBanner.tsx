import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";

export function ArtisanBanner() {
  return (
    <div className="mt-8 pt-6 bg-surface-container-low rounded-lg p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon size="md" filled className="text-primary">palette</Icon>
        <div className="flex flex-col">
          <span className="text-label-md text-on-surface">Are you a master craftsperson?</span>
          <span className="text-caption text-on-surface-variant">Access studio registry and direct provenance vaults</span>
        </div>
      </div>
      <Link href="#artisan-apply" className="text-label-sm font-semibold text-primary hover:text-primary-container shrink-0 flex items-center gap-0.5">
        <span>Apply</span>
        <Icon size="xs">chevron_right</Icon>
      </Link>
    </div>
  );
}
