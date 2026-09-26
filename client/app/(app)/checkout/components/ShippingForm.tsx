import { Input } from "@/components/ui/components/Input";
import { Icon } from "@/components/ui/components/Icon";
import { DELIVERY_METHODS, formatPrice, type DeliveryMethodId } from "./delivery-methods";

export type ShippingValues = {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  deliveryMethod: DeliveryMethodId;
};

export type ShippingErrors = Partial<
  Record<"fullName" | "address" | "city" | "zip" | "country", string>
>;

export type ShippingField = keyof ShippingValues;

const TEXT_FIELDS: { name: Exclude<ShippingField, "deliveryMethod" | "country">; label: string; placeholder: string; icon: string }[] = [
  { name: "fullName", label: "Full Name", placeholder: "Your full name", icon: "person" },
  { name: "address", label: "Street Address", placeholder: "Street and apartment", icon: "home" },
  { name: "city", label: "City", placeholder: "City", icon: "location_city" },
  { name: "zip", label: "Postal Code", placeholder: "ZIP code", icon: "markunread_mailbox" },
];

const COUNTRIES: { code: string; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "AE", label: "United Arab Emirates" },
];

type Props = {
  values: ShippingValues;
  errors: ShippingErrors;
  onChange: (field: ShippingField, value: string) => void;
};

export function ShippingForm({ values, errors, onChange }: Props) {
  return (
    <section
      aria-label="Shipping details"
      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 pb-4">
        <Icon size="md" className="text-primary">
          local_shipping
        </Icon>
        <h2 className="text-headline-sm text-on-surface">Shipping Details</h2>
      </div>
      <div className="flex flex-col gap-4">
        {TEXT_FIELDS.slice(0, 2).map((field) => (
          <Input
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            icon={field.icon}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        ))}
        <div className="grid grid-cols-2 gap-4">
          {TEXT_FIELDS.slice(2).map((field) => (
            <Input
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              icon={field.icon}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="shipping-country" className="font-label-sm text-label-sm text-on-surface">
            Country
          </label>
          <select
            id="shipping-country"
            value={values.country}
            onChange={(event) => onChange("country", event.target.value)}
            className="h-11 w-full rounded-lg bg-surface-container-low px-3.5 text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
          {errors.country && <span className="text-xs text-error">{errors.country}</span>}
        </div>
        <fieldset>
          <legend className="font-label-sm text-label-sm text-on-surface pb-2">
            Delivery Method
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DELIVERY_METHODS.map((method) => {
              const selected = values.deliveryMethod === method.id;
              return (
                <label
                  key={method.id}
                  className={`cursor-pointer rounded-xl p-4 transition-colors ${
                    selected ? "bg-primary-fixed/30" : "bg-surface-container-low hover:bg-surface-container"
                  }`}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery_method"
                        value={method.id}
                        checked={selected}
                        onChange={() => onChange("deliveryMethod", method.id)}
                        className="h-4 w-4 accent-primary cursor-pointer"
                      />
                      <Icon size="md" className="text-primary">
                        {method.icon}
                      </Icon>
                      <span className="text-label-md text-on-surface">{method.label}</span>
                    </span>
                    <span className="text-label-md text-on-surface font-bold">
                      {method.price === 0 ? "Free" : formatPrice(method.price)}
                    </span>
                  </span>
                  <span className="block pt-2 text-caption text-on-surface-variant">
                    {method.description} • {method.eta}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
