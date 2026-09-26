import type { AuthMode } from "./AuthShell";

const MODES: { id: AuthMode; label: string }[] = [
  { id: "login", label: "Sign In" },
  { id: "register", label: "Create Account" },
];

export function AuthTabs({ mode, onModeChange }: { mode: AuthMode; onModeChange: (mode: AuthMode) => void }) {
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
