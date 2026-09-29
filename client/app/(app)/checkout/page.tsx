"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/components/auth/AuthContext";
import { ordersService } from "@/services/orders.service";
import { Icon } from "@/components/ui/components/Icon";
import { DELIVERY_METHODS, formatPrice } from "./components/delivery-methods";
import { CheckoutSteps } from "./components/CheckoutSteps";
import { CartReview } from "./components/CartReview";
import {
  ShippingForm,
  type ShippingErrors,
  type ShippingField,
  type ShippingValues,
} from "./components/ShippingForm";
import {
  PaymentForm,
  validateCard,
  type CardErrors,
  type CardField,
  type CardValues,
} from "./components/PaymentForm";
import { OrderSummary } from "./components/OrderSummary";
import { ConfirmationView } from "./components/ConfirmationView";

const INITIAL_SHIPPING: ShippingValues = {
  fullName: "",
  address: "",
  city: "",
  zip: "",
  country: "",
  deliveryMethod: "standard",
};

const INITIAL_CARD: CardValues = {
  number: "",
  expiry: "",
  cvc: "",
};

function validateShipping(values: ShippingValues): ShippingErrors {
  const errors: ShippingErrors = {};
  if (values.fullName.trim().length === 0) errors.fullName = "Full name is required.";
  if (values.address.trim().length === 0) errors.address = "Street address is required.";
  if (values.city.trim().length === 0) errors.city = "City is required.";
  if (values.zip.trim().length < 3) errors.zip = "Enter a valid postal code.";
  if (values.country.trim().length === 0) errors.country = "Select a country.";
  return errors;
}

export default function CheckoutPage() {
  const { items, count, total: subtotal, loading: cartLoading, updateQty, remove, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingValues>(INITIAL_SHIPPING);
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [card, setCard] = useState<CardValues>(INITIAL_CARD);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const method = DELIVERY_METHODS.find((entry) => entry.id === shipping.deliveryMethod) ?? DELIVERY_METHODS[0];
  const shippingCost = method.price;
  const total = subtotal + shippingCost;

  const handleShippingChange = (field: ShippingField, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCardChange = (field: CardField, value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
    setCardErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextShippingErrors = validateShipping(shipping);
    const nextCardErrors = validateCard(card);
    setShippingErrors(nextShippingErrors);
    setCardErrors(nextCardErrors);
    if (Object.keys(nextShippingErrors).length > 0 || Object.keys(nextCardErrors).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    void (async () => {
      try {
        const order = await ordersService.create({
          fullName: shipping.fullName.trim(),
          address: shipping.address.trim(),
          city: shipping.city.trim(),
          zip: shipping.zip.trim(),
          country: shipping.country,
          deliveryMethod: shipping.deliveryMethod,
        });
        const cleared = await clear();
        if (!cleared) {
          setOrderId(order.id);
          setSubmitError(`Order ${order.id} placed but cart cleanup failed. Your cart was preserved — try clearing it again.`);
          return;
        }
        setOrderId(order.id);
        setStep(2);
      } catch (err) {
        console.error("[checkout submit]", err);
        setSubmitError("We could not place your order. Try again.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  if (!authLoading && !user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-4 pt-4 lg:pt-6">
          <div>
            <h1 className="text-headline-md text-on-surface">Checkout</h1>
            <p className="text-body-sm text-on-surface-variant">
              Review your cart, add shipping and payment details.
            </p>
          </div>
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
            <Icon size="xl" className="text-outline">
              lock
            </Icon>
            <p className="text-headline-sm text-on-surface">Sign in to complete your order</p>
            <p className="text-body-sm text-on-surface-variant">
              Your cart is saved and will be waiting after you sign in.
            </p>
            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
            >
              <Icon size="md">login</Icon>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6">
        <div>
          <h1 className="text-headline-md text-on-surface">Checkout</h1>
          <p className="text-body-sm text-on-surface-variant">
            Review your cart, add shipping and payment details.
          </p>
        </div>
        <CheckoutSteps current={step} />
        {cartLoading || authLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" aria-label="Loading checkout">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="h-48 animate-pulse rounded-2xl bg-surface-container-lowest shadow-sm" />
              <div className="h-64 animate-pulse rounded-2xl bg-surface-container-lowest shadow-sm" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-72 animate-pulse rounded-2xl bg-surface-container-lowest shadow-sm" />
            </div>
          </div>
        ) : step === 2 && orderId ? (
          <ConfirmationView orderId={orderId} />
        ) : count === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
            <Icon size="xl" className="text-outline">
              shopping_bag
            </Icon>
            <p className="text-headline-sm text-on-surface">Your cart is empty</p>
            <p className="text-body-sm text-on-surface-variant">
              Add some works from independent makers to get started.
            </p>
            <Link
              href="/products"
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
            >
              <Icon size="md">arrow_forward</Icon>
              Browse products
            </Link>
          </div>
        ) : step === 0 ? (
          <div className="flex flex-col gap-4">
            <CartReview items={items} onUpdateQty={(id, qty) => void updateQty(id, qty)} onRemove={(id) => void remove(id)} />
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <Icon size="md">arrow_back</Icon>
                Continue shopping
              </Link>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
              >
                Shipping & payment
                <Icon size="md">arrow_forward</Icon>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <CartReview items={items} onUpdateQty={(id, qty) => void updateQty(id, qty)} onRemove={(id) => void remove(id)} />
              <ShippingForm values={shipping} errors={shippingErrors} onChange={handleShippingChange} />
              <PaymentForm values={card} errors={cardErrors} onChange={handleCardChange} />
              {submitError && (
                <p role="alert" className="flex items-center gap-2 rounded-xl bg-error-container p-3 text-body-sm text-on-error-container">
                  <Icon size="md">error</Icon>
                  {submitError}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <Icon size="md">arrow_back</Icon>
                    Back to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.98] disabled:opacity-50"
                  >
                    <Icon size="md">lock</Icon>
                    {submitting ? "Placing order…" : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingLabel={method.label}
                shippingCost={shippingCost}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
