import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  ENROLLMENT_STATUS_LIST,
  type EnrollmentDto,
  type EnrollmentStatus,
} from "@/lib/constants/enrollments";
import { ROLES } from "@/lib/constants/users";
import {
  getMyEnrollments,
  getStudentEnrollments,
} from "@/services/enrollments";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EnrollmentCard, { SkeletonEnrollmentCard } from "./EnrollmentCard";

export default function StudentEnrollments({
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
