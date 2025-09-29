import { useAuth } from "@/context/AuthContext";
import {
  COURSE_SORT_OPTIONS,
  ENROLLMENT_STATUS_LIST,
  ROLES,
  type EnrollmentDto,
} from "@/lib/constants";
import NotFoundPage from "./auth/NotFoundPage";
import { useEffect, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "sonner";
import { getMyEnrollments } from "@/services/enrollments";
import EnrollmentCard, {
  SkeletonEnrollmentCard,
} from "@/components/courses/EnrollmentCard";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourses } from "@/services/courses";
import SearchBar from "@/components/ui/custom/SearchBar";
import MyDialog from "@/components/ui/custom/MyDialog";
import FilterIconSvg from "@/components/ui/custom/FilterIconSvg";
import CategoriesSelect from "@/components/forms/CategoriesSelect";
import TagsMultiSelect from "@/components/forms/TagsMultiSelect";
import SortIconSvg from "@/components/ui/custom/SortIconSvg";
import {
  SortDirectionSelect,
  SortOptionSelect,
} from "@/components/forms/SortOptionSelect";
import { CourseList } from "@/components/courses/CourseList";
import MyPagination from "@/components/ui/custom/MyPagination";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { getUser } from "@/services/users";
import PageTitle from "@/components/ui/custom/PageTitle";

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role == ROLES.STUDENT) return <StudentHomePage />;
  if (user?.role == ROLES.TUTOR) return <TutorHomePage userId={user.sub} />;
  return <NotFoundPage />;
}

function TutorHomePage({ userId }: { userId: string }) {
  const { data: user } = useCachedAsync("getUser", getUser, [userId], []);

  // filters
  const [title, setTitle] = useState("");
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

  if (!user?.tutorProfile) return <NotFoundPage />;
  return (
    <main>
      <PageTitle>My Courses</PageTitle>
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
          }}
        >
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
      <CourseList showStatus data={data?.items} />

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

function StudentHomePage() {
  const [enrollmentStatus, setEnrollmentStatus] = useState(" ");

  // fetch posts
  const { data, error } = useCachedAsync(
    `getMy${enrollmentStatus}Enrollments`,
    getMyEnrollments,
    [{ enrollmentStatus }],
    [enrollmentStatus]
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load enrollments`);
    }
  }, [error]);

  return (
    <main>
      <PageTitle>My Enrollments</PageTitle>
      <div>
        {/* Enrollment Status Tabs  */}

        <div>
          <Label>
            <p className="opacity-80 ms-1 mb-2">Enrollment Status:</p>
          </Label>
          <Select
            onValueChange={setEnrollmentStatus}
            value={enrollmentStatus}
            defaultValue={enrollmentStatus}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select Status"
                defaultValue={enrollmentStatus}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All</SelectItem>
              {ENROLLMENT_STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* cards */}
      <div className="flex flex-wrap justify-start gap-16">
        {data
          ? data.map((enrollment: EnrollmentDto) => (
              <EnrollmentCard key={enrollment.course.id} {...enrollment} />
            ))
          : [1, 2, 3].map((i) => <SkeletonEnrollmentCard key={i} />)}
      </div>
    </main>
  );
}
