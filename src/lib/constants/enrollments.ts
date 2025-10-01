import type { PartialCourseDto } from "./courses";
import type { PartialUserDto, StudentProfileDto } from "./users";

export type EnrollmentStatus =
  | "Pending"
  | "Active"
  | "Passed"
  | "Failed"
  | "Suspended"
  | "Dropped";
export const ENROLLMENT_STATUS_LIST: EnrollmentStatus[] = [
  "Pending",
  "Active",
  "Passed",
  "Failed",
  "Suspended",
  "Dropped",
];
export const ENROLLMENT_STATUSES: Record<string, EnrollmentStatus> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  PASSED: "Passed",
  FAILED: "Failed",
  SUSPENDED: "Suspended",
  DROPPED: "Dropped",
};

export type EnrollmentDto = {
  course: PartialCourseDto;
  userId: string;
  status: EnrollmentStatus;
};

export type ExtendedEnrollmentDto = {
  course: PartialCourseDto;
  status: EnrollmentStatus;
  user: PartialUserDto;
  studentProfile: StudentProfileDto;
};