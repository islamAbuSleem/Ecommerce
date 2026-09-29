"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import type { Product } from "@/services/products.service";
import { sellerService, type ProductPayload, type SellerProductStatus } from "@/services/seller.service";
import { EssentialsSection } from "./EssentialsSection";
import { MediaGallerySection } from "./MediaGallerySection";
import { PricingStockSection } from "./PricingStockSection";
import {
  IMAGE_URL_PATTERN,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGES,
  MAX_NAME_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_IMAGES,
  MIN_NAME_LENGTH,
  MIN_PRICE,
  PRODUCT_CATEGORY_IDS,
} from "./productFormConfig";

/** `edit` always carries the product, so it can never fall through to `createProduct`. */
type Props =
  | { mode: "create" }
  | { mode: "edit"; product: Product };

type FieldErrors = {
  name?: string;
  category?: string;
  description?: string;
  images?: string;
  price?: string;
  stock?: string;
  status?: string;
};

const EMPTY_ERRORS: FieldErrors = {};

const SECTION_ANCHORS = [
  { href: "#section-media", label: "Media" },
  { href: "#section-essentials", label: "Basics" },
  { href: "#section-pricing", label: "Pricing & stock" },
];

const SUBMIT_ERROR_ID = "product-submit-error";

export function ProductForm(props: Props) {
  const router = useRouter();
  const { mode } = props;
  const product = props.mode === "edit" ? props.product : undefined;
  const isEdit = mode === "edit" && product !== undefined;
  const removed = product?.status === "deleted";

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [draftUrl, setDraftUrl] = useState("");
  const [draftError, setDraftError] = useState<string | undefined>(undefined);
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [freeShipping, setFreeShipping] = useState(product?.freeShipping ?? false);
  const [status, setStatus] = useState<SellerProductStatus>(
    product?.status === "inactive" ? "inactive" : "active",
  );
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (removed && product) {
    return <RemovedListingState product={product} />;
  }

  const addImage = () => {
    const trimmed = draftUrl.trim();
    if (!trimmed) {
      setDraftError("Paste an image URL first.");
      return;
    }
    if (!IMAGE_URL_PATTERN.test(trimmed)) {
      setDraftError("That does not look like a valid http(s) URL.");
      return;
    }
    if (images.includes(trimmed)) {
      setDraftError("That image is already on this listing.");
      return;
    }
    if (images.length >= MAX_IMAGES) {
      setDraftError(`A listing can hold at most ${MAX_IMAGES} images.`);
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setDraftUrl("");
    setDraftError(undefined);
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    const trimmedName = name.trim();
    if (trimmedName.length < MIN_NAME_LENGTH) {
      next.name = `Give the piece a title of at least ${MIN_NAME_LENGTH} characters.`;
    } else if (trimmedName.length > MAX_NAME_LENGTH) {
      next.name = `Titles are capped at ${MAX_NAME_LENGTH} characters.`;
    }

    if (!category) next.category = "Pick the directory this piece belongs in.";
    else if (!PRODUCT_CATEGORY_IDS.includes(category)) {
      next.category = "That category is not part of the marketplace taxonomy.";
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
      next.description = `Tell buyers about the piece in at least ${MIN_DESCRIPTION_LENGTH} characters.`;
    } else if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      next.description = `Descriptions are capped at ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    const parsedPrice = Number(price);
    if (!price.trim()) next.price = "Set a listing price.";
    else if (!Number.isFinite(parsedPrice) || parsedPrice < MIN_PRICE) {
      next.price = `Price has to be ${MIN_PRICE} or more.`;
    }

    const parsedStock = Number(stock);
    if (!stock.trim()) next.stock = "Enter how many units you have.";
    else if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      next.stock = "Stock must be a whole number, zero or more.";
    }

    if (status !== "active" && status !== "inactive") {
      next.status = "Pick a listing status.";
    }

    if (images.length < MIN_IMAGES) next.images = "Add at least one image URL before saving.";

    return next;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: ProductPayload = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
      images,
      freeShipping,
      status,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      if (props.mode === "edit") {
        await sellerService.updateProduct(props.product.id, payload);
      } else {
        await sellerService.createProduct(payload);
      }
      router.replace("/seller/dashboard");
    } catch (err: unknown) {
      console.error("[seller/product-form]", err);
      const apiStatus = err instanceof ApiError ? err.status : undefined;
      setSubmitError(
        apiStatus === 403
          ? "This listing isn't yours to change."
          : "We couldn't save that listing. Try again in a moment.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 lg:gap-5">
      <nav
        aria-label="Form sections"
        className="flex items-center gap-1.5 overflow-x-auto rounded-lg bg-surface-container-low px-1 py-1"
      >
        {SECTION_ANCHORS.map((anchor) => (
          <a
            key={anchor.href}
            href={anchor.href}
            className="whitespace-nowrap rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-sm text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container"
          >
            {anchor.label}
          </a>
        ))}
      </nav>

      <MediaGallerySection
        images={images}
        draftUrl={draftUrl}
        draftError={draftError}
        listError={errors.images}
        disabled={submitting}
        onDraftChange={(value) => {
          setDraftUrl(value);
          if (draftError) setDraftError(undefined);
        }}
        onAdd={addImage}
        onRemove={removeImage}
      />

      <EssentialsSection
        name={name}
        category={category}
        description={description}
        errors={errors}
        disabled={submitting}
        onName={(value) => {
          setName(value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        onCategory={(value) => {
          setCategory(value);
          if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
        }}
        onDescription={(value) => {
          setDescription(value);
          if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
        }}
      />

      <PricingStockSection
        price={price}
        stock={stock}
        freeShipping={freeShipping}
        status={status}
        errors={errors}
        disabled={submitting}
        onPrice={(value) => {
          setPrice(value);
          if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
        }}
        onStock={(value) => {
          setStock(value);
          if (errors.stock) setErrors((prev) => ({ ...prev, stock: undefined }));
        }}
        onFreeShipping={setFreeShipping}
        onStatus={(value) => {
          setStatus(value === "inactive" ? "inactive" : "active");
          if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }));
        }}
      />

      {submitError && (
        <p
          id={SUBMIT_ERROR_ID}
          role="alert"
          className="rounded-lg bg-error-container px-3.5 py-2.5 text-body-sm text-on-error-container"
        >
          {submitError}
        </p>
      )}

      <div className="sticky bottom-0 z-30 flex items-center gap-2 rounded-xl bg-surface-container-lowest/95 p-3 shadow-card backdrop-blur-lg">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-4 py-2.5 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <Icon size="sm" aria-hidden="true">arrow_back</Icon>
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon size="sm" aria-hidden="true">{submitting ? "progress_activity" : "check_circle"}</Icon>
          {submitting ? "Saving…" : isEdit ? "Save listing changes" : "Publish to marketplace"}
        </button>
      </div>
    </form>
  );
}

function RemovedListingState({ product }: { product: Product }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-outline">
        <Icon size="lg" aria-hidden="true">delete</Icon>
      </span>
      <h2 className="text-headline-md text-on-surface">This listing was removed</h2>
      <p className="max-w-md text-body-md text-on-surface-variant">
        {product.name} is no longer in your catalog and cannot be edited or published again. Create
        a new listing if you want to sell this piece again.
      </p>
      <Link
        href="/seller/dashboard"
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
      >
        <Icon size="sm" aria-hidden="true">arrow_back</Icon>
        Back to dashboard
      </Link>
    </div>
  );
}
