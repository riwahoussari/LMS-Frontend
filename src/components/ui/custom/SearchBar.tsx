import { Input } from "../input";

export default function SearchBar({
  value,
  onChange,
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="w-3/4 max-w-96">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        placeholder={placeholder || ""}
      />
    </div>
  );
}
