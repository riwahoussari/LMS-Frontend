import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  ROLES,
  type CourseDto,
  type ExtendedEnrollmentDto,
} from "@/lib/constants";
import {
  getEnrollmentStatusColor,
  getEnrollmentStatusSelectOptions,
} from "@/lib/courseUtils";
import { dateHasPassed } from "@/lib/utils";
import {
  getCourseEnrollments,
  updateEnrollmentStatus,
} from "@/services/enrollments";
import { Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EnrolledStudentsSection({
  course,
}: {
  course: CourseDto;
}) {
  const { user } = useAuth();

  var isTutor = user && user.role === ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course.tutorProfiles?.some((tp) => tp.userId === user?.sub);
  var isAdmin = user && user.role === ROLES.ADMIN;

  const {
    data: enrollments,
    error,
    loading,
  } = useCachedAsync(
    `getCourseEnrollemts${course.id}`,
    getCourseEnrollments,
    [course.id],
    [course.id]
  );

  if (!isAssignedTutor && !isAdmin) return;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Enrolled Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p className="text-red-600">Couldn't load enrolled students</p>
        )}
        <div className="divide-foreground/10 divide-y-1 space-y-6 border-t-1 border-foreground/10 pt-6">
          {/* Enrollments */}

          {isAssignedTutor &&
            enrollments?.map((e) => (
              <EnrolledStudentRow
                key={e.user.id + course.id}
                enrollment={e}
                course={course}
              />
            ))}
          {enrollments?.length == 0 && (
            <p className="opacity-60">No Enrollments Found.</p>
          )}
          {isAdmin &&
            enrollments?.map((e) => (
              <div className="pb-6 flex justify-between items-center">
                <div>
                  <p className="capitalize text-lg font-medium ">
                    {e.user.firstName} {e.user.lastName}
                  </p>
                  <p className="opacity-60 -mt-1">{e.user.email}</p>
                </div>

                <p className={getEnrollmentStatusColor(e.status)}>{e.status}</p>
              </div>
            ))}

          {/* loading skeleton */}
          {loading &&
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="pb-6 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="w-52 h-6" />
                  <Skeleton className="w-44 h-4" />
                </div>

                <Skeleton className="h-9 w-30" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EnrolledStudentRow({
  enrollment: { studentProfile, user, status: defaultStatus },
  course,
}: {
  enrollment: ExtendedEnrollmentDto;
  course: CourseDto;
}) {
  const courseEnded = dateHasPassed(course.schedule.endDate);

  const [status, setStatus] = useState<string>(defaultStatus);
  const [options, setOptions] = useState(
    getEnrollmentStatusSelectOptions(defaultStatus, courseEnded)
  );

  const { clearCacheKey } = useCachedAsync("", async () => null, [], [], {
    enabled: false,
  });

  const handleChange = async (value: string) => {
    if (!course) return;
    if (!studentProfile.id) return;

    setOptions([]);
    setStatus("");
    try {
      await updateEnrollmentStatus({
        courseId: course.id,
        studentProfileId: studentProfile.id,
        newStatus: value,
      });
      setStatus(value);
      setOptions(getEnrollmentStatusSelectOptions(value, courseEnded));
      clearCacheKey(`getCourseEnrollemts${course.id}`);
    } catch (err) {
      console.error("Failed to update enrollment status", err);
      toast.error("Failed to update enrollment status.");
      setStatus(status);
      setOptions(getEnrollmentStatusSelectOptions(status, courseEnded));
    }
  };

  return (
    <div className="pb-6 flex justify-between items-center">
      <div>
        <p className="capitalize text-lg font-medium ">
          {user.firstName} {user.lastName}
        </p>
        <p className="opacity-60 -mt-1">{user.email}</p>
      </div>

      <Select
        defaultValue={status}
        value={status}
        disabled={options.length == 0}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {status && <SelectItem value={status}>{status}</SelectItem>}
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
