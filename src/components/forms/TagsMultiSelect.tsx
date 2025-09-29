import { useEffect } from "react";
import { toast } from "sonner";
import { getTags } from "@/services/tags";
import { MultiSelect } from "../ui/custom/MultiSelect";
import { Label } from "@radix-ui/react-label";
import { useCachedAsync } from "@/hooks/useCachedAsync";

type Props = {
  tagIds: string[];
  setTagIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagsMultiSelect({ tagIds, setTagIds }: Props) {
  const { data: tags, error } = useCachedAsync("getTags", getTags, [], []);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load tags`);
    }
  }, [error]);

  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-2">Tags</p>
      </Label>
      <MultiSelect
        hideSelectAll
        options={
          tags
            ? tags.map((tag) => {
                return { value: tag.id, label: tag.name };
              })
            : []
        }
        value={tagIds}
        onValueChange={setTagIds}
        placeholder="Choose tags..."
      />
    </div>
  );
}
