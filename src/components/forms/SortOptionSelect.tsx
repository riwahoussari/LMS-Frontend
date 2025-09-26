import type { TSelectOption } from "@/lib/constants";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SortOptionSelect({
  options,
  sortBy,
  setSortBy,
}: {
  options: TSelectOption[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-1">Sort:</p>
      </Label>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SortDirectionSelect({
  sortAsc,
  setSortAsc,
}: {
  sortAsc: boolean;
  setSortAsc: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-1">Sort Direction:</p>
      </Label>
      <Select
        value={sortAsc ? "true" : "false"}
        onValueChange={(v) => setSortAsc(v === "true")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Ascending</SelectItem>
          <SelectItem value="false">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}