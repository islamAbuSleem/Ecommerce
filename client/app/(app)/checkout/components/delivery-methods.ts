export type DeliveryMethodId = "standard" | "express";

export type DeliveryMethod = {
  id: DeliveryMethodId;
  label: string;
  description: string;
  eta: string;
  price: number;
  icon: string;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: "standard",
    label: "Standard Insured Delivery",
    description: "Tracked carrier with direct tracking",
    eta: "3–5 business days",
    price: 0,
    icon: "local_shipping",
  },
  {
    id: "express",
    label: "Express Artisan Dispatch",
    description: "Priority courier dispatch",
    eta: "1–2 business days",
    price: 12,
    icon: "bolt",
  },
];

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
