import { Icon } from "@/components/ui/components/Icon";
import { UNAVAILABLE_SECTIONS } from "../../components/adminConfig";

export function NotConfiguredPanel() {
  return (
    <section
      className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6"
      aria-labelledby="not-configured-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            id="not-configured-heading"
            className="flex items-center gap-2 text-headline-sm text-on-surface"
          >
            <Icon size="md" className="text-outline" aria-hidden="true">tune</Icon>
            Not configured
          </h2>
          <p className="mt-0.5 text-caption text-on-surface-variant">
            Provider integrations Aura has not made yet.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
          0 checks run
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {UNAVAILABLE_SECTIONS.map((section) => (
          <li
            key={section.title}
            className="flex items-start gap-3 rounded-lg bg-surface-container-low/50 p-3"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container text-outline"
            >
              <Icon size="sm" aria-hidden="true">{section.icon}</Icon>
            </span>
            <div className="min-w-0">
              <p className="text-label-md text-on-surface-variant">{section.title}</p>
              <p className="mt-0.5 text-caption text-on-surface-variant">{section.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
