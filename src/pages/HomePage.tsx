import { useAuth } from "@/context/AuthContext";
import {
  ENROLLMENT_STATUS_LIST,
  ROLES,
  type EnrollmentDto,
} from "@/lib/constants";
import NotFoundPage from "./NotFoundPage";
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

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role == ROLES.STUDENT) return <StudentHomePage />;
  if (user?.role == ROLES.TUTOR) return <TutorHomePage />;
  return <NotFoundPage />;
}

function TutorHomePage() {
  return <h1>Tutor home page</h1>;
}

function StudentHomePage() {
  const [enrollmentStatus, setEnrollmentStatus] = useState(" ");

  // fetch posts
  const { data, error } = useAsync(
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
      <h1 className="font-semibold text-3xl">My Enrollments</h1>
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
