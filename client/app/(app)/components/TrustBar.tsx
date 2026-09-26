const GUARANTEES: { icon: string; title: string; sub: string }[] = [
  { icon: "verified_user", title: "Buyer Safe", sub: "Full refund escrow" },
  { icon: "local_shipping", title: "Direct Dispatch", sub: "Tracked craft transit" },
  { icon: "eco", title: "Mindful Packs", sub: "Zero plastic waste" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Marketplace guarantees"
      className="rounded-xl bg-surface-container-lowest p-4 shadow-sm"
    >
      <div className="grid grid-cols-3 gap-2 text-center">
        {GUARANTEES.map(({ icon, title, sub }) => (
          <div key={title} className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
            <span className="text-[11px] font-semibold text-on-surface">{title}</span>
            <span className="text-[10px] text-on-surface-variant">{sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
