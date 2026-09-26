import { Icon } from "@/components/ui/components/Icon";

export type CardValues = {
  number: string;
  expiry: string;
  cvc: string;
};

export type CardErrors = Partial<Record<keyof CardValues, string>>;

export type CardField = keyof CardValues;

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function validateCard(values: CardValues): CardErrors {
  const errors: CardErrors = {};
  const digits = values.number.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) {
    errors.number = "Enter a valid card number.";
  }
  const expiryDigits = values.expiry.replace(/\D/g, "");
  const month = Number(expiryDigits.slice(0, 2));
  const year = Number(expiryDigits.slice(2, 4));
  if (expiryDigits.length !== 4 || month < 1 || month > 12) {
    errors.expiry = "Use MM / YY format.";
  } else {
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      errors.expiry = "This card has expired.";
    }
  }
  if (!/^\d{3,4}$/.test(values.cvc)) {
    errors.cvc = "Enter the 3–4 digit code.";
  }
  return errors;
}

type Props = {
  values: CardValues;
  errors: CardErrors;
  onChange: (field: CardField, value: string) => void;
};

export function PaymentForm({ values, errors, onChange }: Props) {
  return (
    <section
      aria-label="Payment"
      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Icon size="md" className="text-primary">
            payments
          </Icon>
          <h2 className="text-headline-sm text-on-surface">Payment</h2>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <Icon size="sm" className="text-primary">
            verified_user
          </Icon>
          <span className="text-caption">256-bit SSL</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="card-number" className="font-label-sm text-label-sm text-on-surface">
            Card Information
          </label>
          <div className="flex items-center gap-2 rounded-lg bg-surface-container-low p-2.5 shadow-inner">
            <Icon size="md" className="text-outline">
              credit_card
            </Icon>
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="Card number"
              value={values.number}
              onChange={(event) => onChange("number", formatCardNumber(event.target.value))}
              className="flex-1 bg-transparent text-on-surface font-body-md text-body-md focus:outline-none"
            />
            <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-[10px] font-bold text-on-surface">
              VISA
            </span>
            <span className="rounded bg-surface-container-highest px-1.5 py-0.5 text-[10px] font-bold text-on-surface">
              MC
            </span>
          </div>
          {errors.number && <span className="text-xs text-error">{errors.number}</span>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="card-expiry" className="font-label-sm text-label-sm text-on-surface">
              Expiration
            </label>
            <input
              id="card-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM / YY"
              value={values.expiry}
              onChange={(event) => onChange("expiry", formatExpiry(event.target.value))}
              className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-inner"
            />
            {errors.expiry && <span className="text-xs text-error">{errors.expiry}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center justify-between font-label-sm text-label-sm text-on-surface">
              <label htmlFor="card-cvc">CVC</label>
              <Icon size="xs" className="text-outline" title="3 digits on back">
                help
              </Icon>
            </span>
            <input
              id="card-cvc"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              placeholder="123"
              value={values.cvc}
              onChange={(event) => onChange("cvc", event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none shadow-inner"
            />
            {errors.cvc && <span className="text-xs text-error">{errors.cvc}</span>}
          </div>
        </div>
        <p className="flex items-center gap-1 text-caption text-on-surface-variant">
          <Icon size="sm" className="text-primary">
            lock
          </Icon>
          Demo checkout — format is validated locally, no real payment is processed.
        </p>
      </div>
    </section>
  );
}
