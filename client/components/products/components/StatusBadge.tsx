export function StatusBadge({ status }: { status: "active" | "inactive" | "deleted" }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-caption font-semibold shadow-sm ${
        status === "active"
          ? "bg-success-lightest text-success-foreground"
          : "bg-surface-container-low text-on-surface-variant"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
