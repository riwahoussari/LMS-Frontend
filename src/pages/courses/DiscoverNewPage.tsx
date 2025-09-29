import CategoriesSelect from "@/components/forms/CategoriesSelect";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { COURSE_SORT_OPTIONS } from "@/lib/constants";
import { getCourses } from "@/services/courses";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import TagsMultiSelect from "@/components/forms/TagsMultiSelect";
import FilterIconSvg from "@/components/ui/custom/FilterIconSvg";
import SortIconSvg from "@/components/ui/custom/SortIconSvg";
import { CourseList } from "@/components/courses/CourseList";
import SearchBar from "@/components/ui/custom/SearchBar";
import MyDialog from "@/components/ui/custom/MyDialog";
import {
  SortDirectionSelect,
  SortOptionSelect,
} from "@/components/forms/SortOptionSelect";
import MyPagination from "@/components/ui/custom/MyPagination";
import TutorsSelect from "@/components/forms/TutorsSelect";

export default function DiscoverNewPage() {
  const { user } = useAuth();

  if (user) return <DiscoverPage />;
  return <Navigate to="/unauthorized" replace />;
}

function DiscoverPage() {
  // filters
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [tutorProfileId, setTutorProfileId] = useState("");
  // sorting
  const [sortBy, setSortBy] = useState(COURSE_SORT_OPTIONS[0]?.value || "");
  const [sortAsc, setSortAsc] = useState(true);
  // pagination
  const limit = 2;
  const [page, setPage] = useState(0);

  const query = {
    title,
    categoryId,
    tagIds,
    tutorProfileId,
    sortBy,
    sortAsc,
    limit,
    offset: page * limit,
  };
  const { data, error } = useAsync(getCourses, [query], [query]);

  useEffect(() => {
    if (error) toast.error("Failed to load courses");
  }, [error]);

  return (
    <main>
      <div className="flex items-end flex-wrap gap-4">
        <SearchBar
          placeholder="Search by title"
          value={title}
          onChange={setTitle}
        />

        {/* filtering dialog */}
        <MyDialog
          icon={<FilterIconSvg className="scale-150" />}
          onClear={() => {
            setCategoryId("");
            setTagIds([]);
            setTutorProfileId("");
          }}
        >
          <CategoriesSelect
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
          <TagsMultiSelect tagIds={tagIds} setTagIds={setTagIds} />
          <TutorsSelect
            tutorProfileId={tutorProfileId}
            setTutorProfileId={setTutorProfileId}
          />
        </MyDialog>

        {/* Sorting Dialog */}
        <MyDialog
          icon={<SortIconSvg className="scale-150" />}
          onClear={() => {
            setSortBy(COURSE_SORT_OPTIONS[0]?.value || "");
            setSortAsc(true);
          }}
        >
          <SortOptionSelect
            options={COURSE_SORT_OPTIONS}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <SortDirectionSelect sortAsc={sortAsc} setSortAsc={setSortAsc} />
        </MyDialog>
      </div>

      {/* cards */}
      <CourseList data={data?.items} />

      {/* pagination */}
      {data && data.items.length > 0 && (
        <MyPagination
          MAX_PAGES={Math.ceil(data.total / limit)}
          page={page}
          setPage={setPage}
        />
      )}
    </main>
  );
}
