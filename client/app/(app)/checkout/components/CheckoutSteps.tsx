import { Icon } from "@/components/ui/components/Icon";

const STEPS: { id: string; label: string; icon: string }[] = [
  { id: "cart", label: "Cart", icon: "shopping_bag" },
  { id: "details", label: "Shipping & Payment", icon: "credit_card" },
  { id: "confirmation", label: "Confirmation", icon: "check" },
];

const FILL_WIDTHS = ["w-0", "w-1/2", "w-full"];

type Props = {
  current: number;
};

export function CheckoutSteps({ current }: Props) {
  return (
    <nav
      aria-label="Checkout steps"
      className="bg-surface-container-lowest rounded-xl p-4 shadow-sm"
    >
      <ol className="relative flex items-center justify-between">
        <div aria-hidden className="absolute right-8 left-8 top-4 h-0.5 bg-surface-container-highest" />
        <div
          aria-hidden
          className={`absolute top-4 left-8 h-0.5 bg-primary transition-all ${FILL_WIDTHS[Math.min(Math.max(current, 0), STEPS.length - 1)]}`}
        />
        {STEPS.map((step, index) => {
          const completed = index < current;
          const active = index === current;
          return (
            <li key={step.id} className="relative z-10 flex flex-col items-center gap-1">
              <span
                aria-current={active ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm ${
                  completed || active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                } ${active ? "ring-4 ring-primary-fixed" : ""}`}
              >
                {completed ? (
                  <Icon size="sm">check</Icon>
                ) : active ? (
                  <Icon size="sm">{step.icon}</Icon>
                ) : (
                  <span className="text-label-sm">{index + 1}</span>
                )}
              </span>
              <span
                className={`text-label-sm ${
                  completed || active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
