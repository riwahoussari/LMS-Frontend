import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  ENROLLMENT_STATUSES,
  type EnrollmentDto,
} from "@/lib/constants/enrollments";
import { ROLES } from "@/lib/constants/users";
import type { CourseDto } from "@/lib/constants/courses";
import {
  getEnrollmentStatusColor,
  getEnrollmentStatusIcon,
} from "@/lib/courseUtils";
import { dateHasPassed } from "@/lib/utils";
import {
  dropCourse,
  enrollIntoCourse,
  getMyEnrollments,
  reEnrollIntoCourse,
} from "@/services/enrollments";
import { getUser } from "@/services/users";
import axios from "axios";
import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EnrollmentSection({ course }: { course: CourseDto }) {
  const { user } = useAuth();
  const { data: fullUser, clearCacheKey } = useCachedAsync(
    `getUser`,
    getUser,
    [user?.sub || ""],
    [user?.sub],
    { enabled: !!user?.sub }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollment, setEnrollment] = useState<EnrollmentDto | null>(null);

  const handleEnroll = async () => {
    if (!course) return;

    setIsSubmitting(true);
    try {
      const res = await enrollIntoCourse({ courseId: course.id });
      setEnrollment(res);
      clearCacheKey("getMyEnrollments");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Failed to enroll you into this course", {
          description: err.response.data,
        });
      else toast.error("Failed to enroll you into this course.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReEnroll = async () => {
    if (!course) return;
    if (!fullUser?.studentProfile?.id) return;

    setIsSubmitting(true);
    try {
      const res = await reEnrollIntoCourse({
        courseId: course.id,
        studentProfileId: fullUser.studentProfile.id,
      });
      setEnrollment(res);
      clearCacheKey("getMyEnrollments");
    } catch (err) {
      console.error("Failed to reenroll into course", err);
      toast.error("Failed to reenroll you into this course.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = async () => {
    if (!course) return;
    if (!fullUser?.studentProfile?.id) return;

    setIsSubmitting(true);
    try {
      const res = await dropCourse({
        courseId: course.id,
        studentProfileId: fullUser.studentProfile.id,
      });
      setEnrollment(res);
      clearCacheKey("getMyEnrollments");
    } catch (err) {
      console.error("Failed to reenroll into course", err);
      toast.error("Failed to reenroll you into this course.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseStarted = dateHasPassed(course.schedule.startDate);
  const courseEnded = dateHasPassed(course.schedule.endDate);

  const isStudent = user?.role == ROLES.STUDENT;

  const { data: myEnrollments } = useCachedAsync(
    `getMyEnrollments`,
    getMyEnrollments,
    [{}],
    [],
    { enabled: isStudent }
  );

  useEffect(() => {
    setEnrollment(myEnrollments?.find((e) => e.course.id == course.id) || null);
  }, [myEnrollments]);

  let prerequisitesComplete = false;
  if (!course.prerequisites || course.prerequisites.length == 0)
    // if no prerequisites => true
    prerequisitesComplete = true;
  else if (!myEnrollments || myEnrollments.length == 0)
    // if no enrollments => false
    prerequisitesComplete = false;
  else
    prerequisitesComplete = course.prerequisites.every((prereq) =>
      myEnrollments.some(
        (enrollment) =>
          enrollment.course.id === prereq.id &&
          enrollment.status === ENROLLMENT_STATUSES.PASSED
      )
    );

  let message = null;

  if (!prerequisitesComplete) message = "Prerequisites not completed";
  if (course.maxCapacity && course.maxCapacity > 0 && course.spotsLeft == 0)
    message = "Course has reached max capacity";
  if (courseStarted) message = "Course already started.";

  const isDropped = enrollment?.status === ENROLLMENT_STATUSES.DROPPED;

  const canDrop =
    enrollment &&
    (enrollment.status === ENROLLMENT_STATUSES.PENDING ||
      enrollment.status === ENROLLMENT_STATUSES.ACTIVE) &&
    !courseEnded;

  if (!isStudent) return;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Enrollment
        </CardTitle>

        <div>
          {/* Enroll Button */}
          {message === null && !enrollment && (
            <Button
              className="cursor-pointer"
              onClick={handleEnroll}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enrolling..." : "Enroll Now"}
            </Button>
          )}

          {/* Re-enroll Button (if dropped) */}
          {message === null && isDropped && (
            <Button
              className="cursor-pointer"
              onClick={handleReEnroll}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enrolling..." : "Re-Enroll"}
            </Button>
          )}

          {/* Drop Button (if peding or active) */}
          {canDrop && (
            <Button
              className="cursor-pointer"
              onClick={handleDrop}
              disabled={isSubmitting}
              variant={"destructive"}
            >
              {isSubmitting ? "Dropping Out..." : "Drop Out"}
            </Button>
          )}

          {/* Cannot enroll reason */}
          {message && !enrollment && <p className="text-red-600">{message}</p>}
        </div>
      </CardHeader>

      {/* Enrollment Status */}
      {enrollment && (
        <CardContent>
          <div className="space-y-2">
            Status:
            <div
              className={`flex items-center gap-2 mt-1 p-2 bg-muted/50 rounded ${getEnrollmentStatusColor(
                enrollment.status
              )}`}
            >
              {getEnrollmentStatusIcon(enrollment.status)}
              <span>{enrollment.status}</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
