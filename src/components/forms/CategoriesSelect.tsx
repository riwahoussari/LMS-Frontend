import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/services/categories";
import { useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useCachedAsync } from "@/hooks/useCachedAsync";

type Props = {
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
};

export default function CategoriesSelect({ categoryId, setCategoryId }: Props) {
  const { data: categories, error } = useCachedAsync("getCategories", getCategories, [], []);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load categories`);
    }
  }, [error]);

  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-2">Category</p>
      </Label>
      <Select onValueChange={setCategoryId} defaultValue={categoryId}>
        <SelectTrigger>
          <SelectValue placeholder="Category" defaultValue={categoryId} />
        </SelectTrigger>
        <SelectContent>
          {categories &&
            categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
