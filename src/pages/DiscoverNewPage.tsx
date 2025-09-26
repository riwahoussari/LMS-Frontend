import CategoriesSelect from "@/components/courses/CategoriesSelect";
import CourseCard, {
  SkeletonCourseCard,
} from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { COURSE_SORT_OPTIONS, type CourseDto } from "@/lib/constants";
import { getCourses } from "@/services/courses";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function DiscoverNewPage() {
  const { user } = useAuth();

  if (user) return <DiscoverPage />;
  return <Navigate to="/unauthorized" replace />;
}

function DiscoverPage() {
  const [title, setTitle] = useState("");
  const [sortValue, setSortValue] = useState(
    COURSE_SORT_OPTIONS[0]?.value || ""
  );
  const [sortAsc, setSortAsc] = useState(true);
  const [categoryId, setCategoryId] = useState("all");

  const query = {
    title,
    sortValue,
    categoryId,
    sortAsc,
  };

  // fetch posts
  const { data, error } = useAsync(getCourses, [query], [query]);

  //   Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load events`);
    }
  }, [error]);

  return (
    <main>
      {/* search - sort - categories */}
      <div>
        <div className="flex flex-wrap gap-4">
          {/* search bar */}
          <div className="w-full">
            <Label>
              <p className="opacity-80 ms-1 mb-1">Search by Title: </p>
            </Label>
            <Input
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-96 w-full "
              name="search"
              placeholder="enter a title"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {/* sort selector */}
            <div>
              <Label>
                <p className="opacity-80 ms-1 mb-1">Sort:</p>
              </Label>
              <Select
                onValueChange={setSortValue}
                defaultValue={COURSE_SORT_OPTIONS[0]?.value}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Sort"
                    defaultValue={COURSE_SORT_OPTIONS[0]?.value}
                  />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* sort direction selector */}
            <div>
              <Label>
                <p className="opacity-80 ms-1 mb-1">Sort Direction:</p>
              </Label>
              <Select
                onValueChange={(v) => setSortAsc(v == "true")}
                defaultValue="true"
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Sort Direction"
                    defaultValue="true"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"true"}>Ascending</SelectItem>
                  <SelectItem value={"false"}>Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Selector */}
            <CategoriesSelect
              categoryId={categoryId}
              setCategoryId={setCategoryId}
            />
          </div>
        </div>
      </div>

      {/* cards */}
      <div className="flex flex-wrap justify-start gap-16">
        {data
          ? data.map((course: CourseDto) => (
              <CourseCard key={course.id} {...course} status={undefined} />
            ))
          : [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCourseCard key={i} />)}
      </div>
    </main>
  );
}
