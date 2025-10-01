import { AlertCircle, CheckCircle, Circle, CircleDashed, CircleMinus, Clock, XCircle } from "lucide-react";
import { ENROLLMENT_STATUSES, type CourseStatus, type EnrollmentStatus } from "./constants";

export const getCourseStatusColor = (status?: CourseStatus) => {
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

export const getCourseStatusBadgeColor = (status?: CourseStatus) => {
  switch (status) {
    case "Published":
      return "text-green-600 border-green-600";
    case "Draft":
      return "text-yellow-600 border-yellow-600";
    case "Archived":
      return "text-red-600 border-red-600";
    default:
      return "text-gray-600 border-gray-600";
  }
};

export const getCourseStatusIcon = (status?: CourseStatus) => {
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

export const getEnrollmentStatusColor = (status?: EnrollmentStatus) => {
  switch (status) {
    case "Active":
      return "text-blue-600 border-blue-600";
    case "Dropped":
      return "text-yellow-600 border-yellow-600";
    case "Failed":
      return "text-red-600 border-red-600";
    case "Passed":
      return "text-green-600 border-green-600";
    case "Pending":
      return "text-foreground/50 border-foreground/50";
    case "Suspended":
      return "text-red-600 border-red-600";
    default:
      return "text-foreground/50 border-foreground/50";
  }
};

export const getEnrollmentStatusIcon = (status?: EnrollmentStatus) => {
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

export const getEnrollmentStatusSelectOptions = (
  status: string,
  courseEnded: boolean
): string[] => {
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
