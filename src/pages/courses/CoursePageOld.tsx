import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Tag,
  ClipboardList,
  Info,
  Circle,
  CircleDashed,
  CircleMinus,
} from "lucide-react";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { getCourse } from "@/services/courses";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ENROLLMENT_STATUSES,
  ROLES,
  type CourseDto,
  type CourseStatus,
  type EnrollmentDto,
  type EnrollmentStatus,
  type ExtendedEnrollmentDto,
} from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { dateHasPassed } from "@/lib/utils";
import {
  dropCourse,
  enrollIntoCourse,
  getCourseEnrollments,
  getMyEnrollments,
  reEnrollIntoCourse,
  updateEnrollmentStatus,
} from "@/services/enrollments";
import { getUser } from "@/services/users";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getCourseStatusColor = (status?: CourseStatus) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800 border-green-200";
    case "Draft":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Archived":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCourseStatusIcon = (status?: CourseStatus) => {
  switch (status) {
    case "Published":
      return <CheckCircle className="h-4 w-4" />;
    case "Draft":
      return <AlertCircle className="h-4 w-4" />;
    case "Archived":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const getEnrollmentStatusColor = (status?: EnrollmentStatus) => {
  switch (status) {
    case "Active":
      return "text-blue-600";
    case "Dropped":
      return "text-yellow-600";
    case "Failed":
      return "text-red-600";
    case "Passed":
      return "text-green-600";
    case "Pending":
      return "text-foreground/50";
    case "Suspended":
      return "text-red-600";
    default:
      return "text-foreground/50";
  }
};

const getEnrollmentStatusIcon = (status?: EnrollmentStatus) => {
  switch (status) {
    case "Active":
      return <CircleDashed className="h-4 w-4" />;
    case "Dropped":
      return <CircleMinus className="h-4 w-4" />;
    case "Failed":
      return <XCircle className="h-4 w-4" />;
    case "Passed":
      return <CheckCircle className="h-4 w-4" />;
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Suspended":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
};

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const {
    data: course,
    error,
    loading,
  } = useCachedAsync(
    `course-${courseId}`,
    getCourse,
    [courseId || ""],
    [courseId]
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-32 " />
          <Skeleton className="h-64 " />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The course you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header  */}
      <HeaderSection course={course} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <EnrollmentSection course={course} />
          <ScheduleSection course={course} />
          <PrerequisitesSection course={course} />
          <EnrolledStudentsSection course={course} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TutorsSection course={course} />
          <TagsSection course={course} />
          <CourseInfoSection course={course} />
        </div>
      </div>
    </div>
  );
}

// Course Header
function HeaderSection({ course }: { course: CourseDto }) {
  const { user } = useAuth();

  var isTutor = user && user.role == ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course.tutorProfiles?.some((tp) => tp.userId === user?.sub);
  var isAdmin = user && user.role == ROLES.ADMIN;
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Title */}
              <CardTitle className="text-3xl">{course.title}</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              {/* Status */}
              {course.status && (isAdmin || isAssignedTutor) && (
                <Badge
                  className={`${getCourseStatusColor(
                    course.status
                  )} flex items-center gap-1`}
                >
                  {getCourseStatusIcon(course.status)}
                  {course.status}
                </Badge>
              )}
              {/* Category */}
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {course.category.name}
              </span>
              {/* Created At */}
              {course.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {format(new Date(course.createdAt), "MMM dd, yyyy")}
                </span>
              )}
            </div>
          </div>

          <div className="text-right space-y-2">
            {/* Spots Left */}
            {!!course.maxCapacity && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{course.spotsLeft} spots left</span>
              </div>
            )}

            {/* Edit Button */}
            {isAssignedTutor && (
              <Button className="cursor-pointer">Edit Course</Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Description */}
        <p className="text-lg leading-relaxed opacity-80">
          {course.description}
        </p>
      </CardContent>
    </Card>
  );
}

// Main content
function ScheduleSection({ course }: { course: CourseDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <p className="text-lg">
              {format(new Date(course.schedule.startDate), "PPP")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <p className="text-lg">
              {format(new Date(course.schedule.endDate), "PPP")}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Sessions</h4>
          <div className="space-y-3">
            {course.schedule.sessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">{session.dayOfWeek}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {session.startTime} - {session.endTime}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {session.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EnrollmentSection({ course }: { course: CourseDto }) {
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
      console.error("Failed to enroll into course", err);
      toast.error("Failed to enroll you into this course.");
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

function PrerequisitesSection({ course }: { course: CourseDto }) {
  const { user } = useAuth();
  const isStudent = user?.role == ROLES.STUDENT;

  const { data: myEnrollments } = useCachedAsync(
    `getMy${ENROLLMENT_STATUSES.PASSED}Enrollments`,
    getMyEnrollments,
    [{ enrollmentStatus: ENROLLMENT_STATUSES.PASSED }],
    [],
    { enabled: isStudent }
  );

  if (!course.prerequisites || course.prerequisites.length == 0) return;

  const updatePrerequisites = course.prerequisites.map((prereq) => {
    return {
      ...prereq,
      userPassed: myEnrollments?.some((e) => e.course.id == prereq.id),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Prerequisites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {updatePrerequisites.map((prerequisite) => (
            <Link
              to={`/courses/${prerequisite.id}`}
              key={prerequisite.id}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded cursor-pointer hover:brightness-125"
            >
              {isStudent && prerequisite.userPassed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-yellow-600" />
              )}
              <span>{prerequisite.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Sidebar
function TutorsSection({ course }: { course: CourseDto }) {
  if (!course.tutorProfiles || course.tutorProfiles.length === 0) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {course.tutorProfiles.map((tutor) => (
          <div key={tutor.id} className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <Link className="hover:underline" to={`/tutors/${tutor.id}`}>
                <h4 className="font-medium">
                  {tutor.firstName} {tutor.lastName}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{tutor.email}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TagsSection({ course }: { course: CourseDto }) {
  if (!course.tags || course.tags.length == 0) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CourseInfoSection({ course }: { course: CourseDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Course Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Max Capacity</span>
          <span className="font-medium">
            {course.maxCapacity ? course.maxCapacity : "Unlimited"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Spots Available</span>
          <span className="font-medium">
            {course.maxCapacity ? course.spotsLeft : "Unlimited"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="secondary">{course.category.name}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Enrolled Students (Assigned Tutor Only)
function EnrolledStudentsSection({ course }: { course: CourseDto }) {
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

function getEnrollmentStatusSelectOptions(
  status: string,
  courseEnded: boolean
): string[] {
  let options: string[] = [];

  switch (status) {
    case ENROLLMENT_STATUSES.PENDING:
      if (!courseEnded) {
        options = [ENROLLMENT_STATUSES.ACTIVE, ENROLLMENT_STATUSES.SUSPENDED];
      }
      break;

    case ENROLLMENT_STATUSES.SUSPENDED:
      if (courseEnded) {
        options = [ENROLLMENT_STATUSES.PASSED, ENROLLMENT_STATUSES.FAILED];
      } else {
        options = [ENROLLMENT_STATUSES.ACTIVE];
      }
      break;

    case ENROLLMENT_STATUSES.ACTIVE:
      if (courseEnded) {
        options = [
          ENROLLMENT_STATUSES.PASSED,
          ENROLLMENT_STATUSES.FAILED,
          ENROLLMENT_STATUSES.SUSPENDED,
        ];
      } else {
        options = [ENROLLMENT_STATUSES.SUSPENDED];
      }
      break;

    case ENROLLMENT_STATUSES.PASSED:
      if (courseEnded) {
        options = [ENROLLMENT_STATUSES.FAILED];
      }
      break;

    case ENROLLMENT_STATUSES.FAILED:
      if (courseEnded) {
        options = [ENROLLMENT_STATUSES.PASSED];
      }
      break;

    default:
      options = [];
  }

  return options;
}
