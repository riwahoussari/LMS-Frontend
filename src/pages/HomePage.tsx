import { useAuth } from "@/context/AuthContext";
import {
  COURSE_SORT_OPTIONS,
  COURSE_STATUSES,
  ENROLLMENT_STATUS_LIST,
  ROLES,
  type CourseStatus,
  type EnrollmentDto,
  type EnrollmentStatus,
} from "@/lib/constants";
import NotFoundPage from "./auth/NotFoundPage";
import { useEffect, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "sonner";
import {
  getMyEnrollments,
  getStudentEnrollments,
} from "@/services/enrollments";
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
import { Navigate } from "react-router-dom";
import LoadingDiv from "@/components/shared/LoadingDiv";
import { CourseStatusSelect } from "@/components/forms/CourseStatusSelect";

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role == ROLES.STUDENT)
    return (
      <main>
        <PageTitle>My Enrollments</PageTitle>
        <StudentEnrollments />
      </main>
    );
  if (user?.role == ROLES.TUTOR)
    return (
      <main>
        <PageTitle>My Courses</PageTitle>
        <TutorCourses showStatus={true} userId={user.sub} />
      </main>
    );
  if (user?.role == ROLES.ADMIN) return <Navigate to={"/courses"} />;
  return <NotFoundPage />;
}

export function TutorCourses({
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

export function StudentEnrollments({
  studentProfileId,
}: {
  studentProfileId?: string;
}) {
  const { user } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>();

  if (!user) return;
  const isStudent = user.role == ROLES.STUDENT;
  const isAdmin = user.role == ROLES.ADMIN;

  if (!isAdmin && !isStudent) return;
  if (isAdmin && !studentProfileId) return;

  // fetch posts
  const fetcher = isStudent ? getMyEnrollments : getStudentEnrollments;
  const cachKey = isStudent
    ? `getMy${enrollmentStatus}Enrollments`
    : `getStudent${studentProfileId}${enrollmentStatus}Enrollments`;

  const filters = isStudent
    ? { enrollmentStatus, studentProfileId: "" }
    : { enrollmentStatus, studentProfileId: studentProfileId! };

  const { data, error } = useCachedAsync(
    cachKey,
    fetcher,
    [filters],
    [enrollmentStatus]
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load enrollments`);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        {/* Enrollment Status Tabs  */}

        <div>
          <Label>
            <p className="opacity-80 ms-1 mb-2">Enrollment Status:</p>
          </Label>
          <Select
            onValueChange={(v) => setEnrollmentStatus(v as EnrollmentStatus)}
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
      <div className="flex flex-wrap justify-start gap-8">
        {data
          ? data.map((enrollment: EnrollmentDto) => (
              <EnrollmentCard key={enrollment.course.id} {...enrollment} />
            ))
          : [1, 2, 3].map((i) => <SkeletonEnrollmentCard key={i} />)}
      </div>
    </div>
  );
}
