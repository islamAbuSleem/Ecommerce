import { Icon } from "@/components/ui/components/Icon";
export function EncryptionNote() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant opacity-80">
      <Icon size="xs">lock</Icon>
      <span className="text-caption">Protected by 256-bit bank-grade encryption &amp; Stripe Identity</span>
    </div>
  );
}
