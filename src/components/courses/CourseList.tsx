import type { CourseDto } from "@/lib/constants";
import CourseCard, { SkeletonCourseCard } from "./CourseCard";

export function CourseList({ data }: { data?: CourseDto[] | null }) {
  if (!data) {
    return (
      <div className="flex flex-wrap justify-start gap-16">
        {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCourseCard key={i} />)}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-start gap-16">
      {data.length == 0 ? <p>No courses found.</p> : data.map((course) => (
        <CourseCard key={course.id} {...course} status={undefined} />
      ))}
    </div>
  );
}
