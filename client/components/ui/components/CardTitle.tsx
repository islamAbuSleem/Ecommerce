type Props = {
  className?: string;
  children: React.ReactNode;
};

export function CardTitle({ children }: Props) {
  return (
    <h2 className="text-base font-semibold leading-6 text-text-primary">
      {children}
    </h2>
  );
}
