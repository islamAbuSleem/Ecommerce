"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden aspect-square flex items-center justify-center">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <span className="flex items-center gap-2 text-caption text-outline">
            <span className="material-symbols-outlined text-[20px]">image</span>
            No image available
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={selected === i}
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
    </div>
  );
}
