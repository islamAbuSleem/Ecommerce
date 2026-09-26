import { Input } from "@/components/ui/components/Input";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function EmailField({
  id = "email",
  label = "Patron or Studio Email",
  placeholder = "you@domain.com",
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-md text-on-surface" htmlFor={id}>{label}</label>
      <Input
        id={id}
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon="mail"
        iconPosition="right"
        required
      />
    </div>
  );
}
