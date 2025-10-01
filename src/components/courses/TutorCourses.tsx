import { useAsync } from "@/hooks/useAsync";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { COURSE_SORT_OPTIONS, COURSE_STATUSES, type CourseStatus } from "@/lib/constants";
import { getCourses } from "@/services/courses";
import { getUser } from "@/services/users";
import { useEffect, useState } from "react";
import LoadingDiv from "../shared/LoadingDiv";
import { toast } from "sonner";
import SearchBar from "@/components/ui/custom/SearchBar";
import MyDialog from "@/components/ui/custom/MyDialog";
import FilterIconSvg from "@/components/ui/custom/FilterIconSvg";
import { CourseStatusSelect } from "../forms/CourseStatusSelect";
import CategoriesSelect from "../forms/CategoriesSelect";
import TagsMultiSelect from "../forms/TagsMultiSelect";
import SortIconSvg from "@/components/ui/custom/SortIconSvg";
import { SortDirectionSelect, SortOptionSelect } from "../forms/SortOptionSelect";
import { CourseList } from "./CourseList";
import MyPagination from "@/components/ui/custom/MyPagination";

export default function TutorCourses({
  userId,
  showStatus = false,
}: {
  userId: string;
  showStatus?: boolean;
}) {
  const { data: user, loading } = useCachedAsync(
    "getUser",
    getUser,
    [userId],
    []
  );

  // filters
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<CourseStatus>();
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  // sorting
  const [sortBy, setSortBy] = useState(COURSE_SORT_OPTIONS[0]?.value || "");
  const [sortAsc, setSortAsc] = useState(true);
  // pagination
  const limit = 2;
  const [page, setPage] = useState(0);

  const query = {
    title,
    status: showStatus ? status : COURSE_STATUSES.PUBLISHED,
    categoryId,
    tagIds,
    tutorProfileId: user?.tutorProfile?.id,
    sortBy,
    sortAsc,
    limit,
    offset: page * limit,
  };
  const { data, error } = useAsync(getCourses, [query], [query]);

  useEffect(() => {
    if (error) toast.error("Failed to load courses");
  }, [error]);

  if (loading) return <LoadingDiv />;
  return (
    <>
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
            setStatus(undefined);
          }}
        >
          {showStatus && (
            <CourseStatusSelect status={status} setStatus={setStatus} />
          )}
          <CategoriesSelect
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
          <TagsMultiSelect tagIds={tagIds} setTagIds={setTagIds} />
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
      <CourseList showStatus={showStatus} data={data?.items} />

      {/* pagination */}
      {data && data.items.length > 0 && (
        <MyPagination
          MAX_PAGES={Math.ceil(data.total / limit)}
          page={page}
          setPage={setPage}
        />
      )}
    </>
  );
}