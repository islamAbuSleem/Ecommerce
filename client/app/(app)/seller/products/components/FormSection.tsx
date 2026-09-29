import { Icon } from "@/components/ui/components/Icon";

type Props = {
  id: string;
  icon: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
};

export function FormSection({ id, icon, title, description, aside, children }: Props) {
  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-headline-sm text-on-surface">
            <Icon size="md" className="text-primary" aria-hidden="true">{icon}</Icon>
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-caption text-on-surface-variant">{description}</p>
          )}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
