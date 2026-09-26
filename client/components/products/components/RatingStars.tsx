export function RatingStars({ value }: { value: number }) {
  return (
    <span className="flex items-center text-tertiary-container" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-[16px] ${i < Math.round(value) ? "icon-filled" : ""}`}
        >
          star
        </span>
      ))}
    </span>
  );
}
