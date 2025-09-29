import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { type CourseDto } from "@/lib/constants";
import { formatDate, getRoundedWeeksBetween } from "@/lib/utils";
import { Button } from "../ui/button";
import { Fragment } from "react";
import { Badge } from "../ui/badge";
import { Check, CheckCheck, CircleCheck } from "lucide-react";

export default function CourseCard({
  id,
  title,
  category,
  status,
  description,
  maxCapacity,
  spotsLeft,
  isUserEnrolled,
  tags,
  schedule,
  tutorProfiles,
}: CourseDto) {
  return (
    <div className="w-xl rounded-md shadow-md border p-6">
      {/* row 1 */}
      <div>
        {/* category & status */}
        <div className="flex justify-between mb-3">
          <p className="rounded-full font-medium px-4 py-1 bg-foreground text-background inline-block">
            {category.name}
          </p>
          {status && (
            <p className=" bg-foreground/0 text-foreground inline-block">
              status:{" "}
              <span
                className="font-medium"
                style={{
                  color:
                    status === "Draft"
                      ? "orange"
                      : status === "Archived"
                      ? "red"
                      : "green",
                }}
              >
                {status}
              </span>
            </p>
          )}
          {isUserEnrolled === true && (
            <Badge className="font-normal text-sm flex items-center gap-1.5" variant={"outline"}>
              <CircleCheck className="w-4! h-4!" />
              Enrolled</Badge>
          )}
        </div>

        {/* title & description */}
        <Link to={`/courses/${id}`} className="hover:underline">
          <p className="text-3xl font-semibold capitalize mb-2">{title}</p>
        </Link>
        <p className="opacity-70 line-clamp-3 w-9/10">{description}</p>
      </div>

      {/* row 2 */}
      <div className="flex justify-between items-start mt-6  border-t pt-6">
        {/* timing */}
        <div>
          <p className="capitalize">
            Starts {formatDate(schedule.startDate, "MMM DD")}
          </p>
          <p>
            Duration:{" "}
            {getRoundedWeeksBetween(schedule.startDate, schedule.endDate)} weeks
          </p>
        </div>

        {/* enroll & spots left */}
        <div>
          <Link to={`/courses/${id}`}>
            <Button
              className="rounded-ful text-lg cursor-pointer"
              size="lg"
              type="button"
            >
              View Course
            </Button>
          </Link>

          {!!maxCapacity && (
            <p className="text-sm opacity-50 text-end pe-2 mt-1">
              {spotsLeft} spots left
            </p>
          )}
        </div>
      </div>

      {/* row 3 */}
      {tutorProfiles && (
        <div className="border-t pt-4 mt-4">
          {/* tutors */}
          <p className="font-medium text-lg mb-2">Tutors</p>
          <div className="flex flex-wrap gap-3">
            {tutorProfiles.map((tp, i) => (
              <Fragment key={tp.id}>
                <Link to={`/tutors/${tp.id}`} className="hover:underline">
                  <p className="capitalize">
                    {tp.firstName + " " + tp.lastName}
                  </p>
                </Link>
                {i !== tutorProfiles.length - 1 && <p>•</p>}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SkeletonCourseCard() {
  return (
    <div className="w-2xl rounded-md shadow-md border p-6">
      {/* row 1 */}
      <div>
        {/* category & status */}
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* title & description */}
        <Skeleton className="h-10 w-3/4 rounded-full mb-6" />
        <Skeleton className="h-4 w-full mb-2 rounded-full" />
        <Skeleton className="h-4 w-full mb-2 rounded-full" />
        <Skeleton className="h-4 w-full mb-2 rounded-full" />
      </div>

      {/* row 2 */}
      <div className="flex justify-between items-start mt-6  border-t pt-6">
        <div>
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div>
          <Skeleton className="h-12 w-24" />
        </div>
      </div>

      {/* row 3 */}
      <div className="border-t pt-6 mt-6">
        {/* tutors */}
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
