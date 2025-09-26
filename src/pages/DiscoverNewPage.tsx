import CategoriesSelect from "@/components/courses/CategoriesSelect";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { COURSE_SORT_OPTIONS } from "@/lib/constants";
import { getCourses } from "@/services/courses";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import TagsSelect from "@/components/courses/TagsSelect";
import FilterIconSvg from "@/components/ui/FilterIconSvg";
import SortIconSvg from "@/components/ui/SortIconSvg";
import { CourseList } from "@/components/courses/CourseList";
import SearchBar from "@/components/courses/SearchBar";
import MyDialog from "@/components/courses/MyDialog";
import { SortDirectionSelect, SortOptionSelect } from "@/components/courses/SortOptionSelect";

export default function DiscoverNewPage() {
  const { user } = useAuth();

  if (user) return <DiscoverPage />;
  return <Navigate to="/unauthorized" replace />;
}

function DiscoverPage() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(
    COURSE_SORT_OPTIONS[0]?.value || ""
  );
  const [sortAsc, setSortAsc] = useState(true);

  const query = { title, categoryId, tagIds, sortBy, sortAsc };
  const { data, error } = useAsync(getCourses, [query], [query]);

  useEffect(() => {
    if (error) toast.error("Failed to load courses");
  }, [error]);

  return (
    <main>
      <div className="flex items-end flex-wrap gap-4">
        <SearchBar placeholder="Search by title" value={title} onChange={setTitle} />

        {/* filtering dialog */}
        <MyDialog
          icon={<FilterIconSvg className="scale-150" />}
          onClear={() => {
            setCategoryId("");
            setTagIds([]);
          }}
        >
          <CategoriesSelect
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
          <TagsSelect tagIds={tagIds} setTagIds={setTagIds} />
        </MyDialog>

        {/* Sorting Dialog */}
        <MyDialog
          icon={<SortIconSvg className="scale-150" />}
          onClear={() => {
            setSortBy(COURSE_SORT_OPTIONS[0]?.value || "");
            setSortAsc(true);
          }}
        >
          <SortOptionSelect options={COURSE_SORT_OPTIONS} sortBy={sortBy} setSortBy={setSortBy} />
          <SortDirectionSelect sortAsc={sortAsc} setSortAsc={setSortAsc} />
        </MyDialog>
      </div>

      {/* cards */}
      <CourseList data={data} />
    </main>
  );
}




