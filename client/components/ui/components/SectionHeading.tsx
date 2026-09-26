type Props = {
  className?: string;
  children: React.ReactNode;
};

export function SectionHeading({ className = "", children }: Props) {
  return (
    <h2 className={`text-base font-semibold text-text-primary ${className}`}>
      {children}
    </h2>
  );
}
