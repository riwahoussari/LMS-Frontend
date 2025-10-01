import NotFoundPage from "../auth/NotFoundPage";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ROLES, type TagStatsDto } from "@/lib/constants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  createTag,
  deleteTag,
  getTagsWithStats,
  updateTag,
} from "@/services/tags";
import axios from "axios";
import { Pencil } from "lucide-react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function TagsPage() {
  const { user } = useAuth();

  if (user?.role !== ROLES.ADMIN) return <NotFoundPage />;

  const [tags, setTags] = useState<TagStatsDto[]>([]);

  const { data, loading, error } = useCachedAsync(
    "getTagsWithStats",
    getTagsWithStats,
    [],
    []
  );

  useEffect(() => {
    setTags(data || []);
  }, [data]);

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Couldn't load Tags.");
    }
  }, [error]);

  // Create new Tag
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    setCreating(true);
    try {
      var newTag = await createTag(inputValue);
      var newStatsTag: TagStatsDto = {
        ...newTag,
        totalCourses: 0,
        totalEnrollments: 0,
      };
      setTags([...tags, newStatsTag]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Couldn't create tag", {
          description: err.response.data,
        });
      else toast.error("Couldn't create tag.");
    } finally {
      setOpen(false);
      setInputValue("");
      setCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <main>
      {/* title and button */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <p className="text-xl font-bold">All Tags</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="cursor-pointer" variant="default">
              Add New Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-4">
            <div>
              <Label className="mb-2 text-base">Tag Name</Label>
              <Input
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                type="text"
                placeholder="Tag name"
              />
            </div>
            <Button className="cursor-pointer" onClick={handleSubmit}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* table */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="text-base font-medium">
              <TableHead>Tag</TableHead>
              <TableHead className="text-center">Total Courses</TableHead>
              <TableHead className="text-center">Total Enrollments</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags &&
              tags.map((tag) => (
                <TagRow key={tag.id} onDelete={handleDelete} tag={tag} />
              ))}
            {loading &&
              [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                  <TableCell>{<Skeleton className="w-16 h-4" />}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

function TagRow({
  tag,
  onDelete,
}: {
  tag: TagStatsDto;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState(tag.name);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    let newName = inputRef.current?.value;
    if (!newName || !newName.length) {
      toast.warning("Enter a value for tag name");
      return;
    }

    try {
      await updateTag(tag.id, { name: newName });
      toast.success("Tag updated.");
      setName(newName);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Couldn't update tag.", {
          description: err.response?.data,
        });
      else toast.error("Couldn't update tag.");
    } finally {
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTag(tag.id);
      toast.success("Tag deleted.");
      onDelete(tag.id);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Couldn't delete Tag.", {
          description: err.response?.data,
        });
      else toast.error("Couldn't delete Tag.");
    } finally {
      setOpen(false);
    }
  };

  return (
    <TableRow key={tag.id} className="text-base">
      <TableCell className="capitalize">{name}</TableCell>
      <TableCell className="text-center">{tag.totalCourses}</TableCell>
      <TableCell className="text-center">{tag.totalEnrollments}</TableCell>
      <TableCell className="text-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50  h-9 px-4 py-2 has-[>svg]:px-3">
              <Pencil className="w-5 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogDescription />
            <DialogTitle />

            <Input defaultValue={tag.name} ref={inputRef} />

            <div className="flex justify-between gap-5 mt-5">
              <Button onClick={handleSubmit}>Update</Button>
              <Button variant={"destructive"} onClick={handleDelete}>
                Delete Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
