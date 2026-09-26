export function AuthDivider() {
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
