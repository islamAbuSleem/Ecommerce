import { Icon } from "@/components/ui/components/Icon";
export function RatingStars({ value }: { value: number }) {
  return (
    <span className="flex items-center text-tertiary-container" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon size="sm" filled={i < Math.round(value)} key={i}>
          star
        </Icon>
      ))}
    </span>
  );
}
