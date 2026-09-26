"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WishlistButton } from "@/components/products/components/WishlistButton";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = images[selected] ?? images[0];

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const openZoom = () => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  };

  const closeZoom = () => dialogRef.current?.close();

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShareFailed(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setShareFailed(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setShareFailed(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden aspect-square flex items-center justify-center">
        {current ? (
          <button
            type="button"
            onClick={openZoom}
            aria-label="Zoom product image"
            className="absolute inset-0 w-full h-full cursor-zoom-in"
          >
            <Image
              src={current}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </button>
        ) : (
          <span className="flex items-center gap-2 text-caption text-outline">
            <span className="material-symbols-outlined text-[20px]">image</span>
            No image available
          </span>
        )}
        {/* Floating overlay row (mobile) */}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between lg:hidden pointer-events-none">
          <button
            type="button"
            onClick={share}
            aria-label="Share this product"
            title="Copy product link"
            className="pointer-events-auto h-7 pl-2 pr-2.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1 text-on-surface-variant shadow-sm active:scale-95 transition-all hover:text-on-surface"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              {copied ? "check" : "share"}
            </span>
            <span aria-live="polite" className="text-label-sm">
              {copied ? "Copied" : shareFailed ? "Failed" : "Share"}
            </span>
          </button>
          <span className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="lg:hidden">
          <WishlistButton />
        </div>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-current={selected === i ? "true" : undefined}
              aria-label={`View image ${i + 1}`}
              onClick={() => setSelected(i)}
              className={`relative aspect-square bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm transition-all hover:opacity-90 ${
                selected === i ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialogRef}
        aria-label={`${name} enlarged view`}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeZoom();
        }}
        className="relative bg-surface-container-lowest rounded-xl shadow-card p-3 backdrop:bg-overlay/70"
      >
        <div className="relative w-[min(88vw,640px)] aspect-square overflow-hidden rounded-lg bg-surface-container-low">
          {current ? (
            <Image
              src={current}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 88vw, 640px"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center gap-2 text-caption text-outline">
              <span className="material-symbols-outlined text-[20px]">image</span>
              No image available
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={closeZoom}
          aria-label="Close zoom"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface-variant shadow-sm active:scale-90 transition-all hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
        </button>
      </dialog>
    </div>
  );
}
