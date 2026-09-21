type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ className = "", children }: Props) {
  return (
    <div className={`mx-auto max-w-7xl px-6 ${className}`}>
      {children}
    </div>
  );
}
