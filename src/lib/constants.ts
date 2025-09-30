// types & dtos
export type Role = "admin" | "tutor" | "student";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  TUTOR: "tutor",
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  limit?: number;
  offset?: number;
};

type FiltersType = {
  sortBy?: string;
  sortAsc?: boolean;
  limit?: number;
  offset?: number;
};
export interface UserFitlersType extends FiltersType {
  role?: Role;
  fullName?: string;
  email?: string;
}

export type UserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: Role;
  birthdate?: string;
  suspended?: boolean;
  studentProfile?: StudentProfileDto;
  tutorProfile?: TutorProfileDto;
};

export type PartialUserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type StudentProfileDto = {
  id: string;
  major: string;
};

export type TutorProfileDto = {
  id: string;
  bio: string;
  expertise: string;
};

export type CourseStatus = "Draft" | "Published" | "Archived";
export const COURSE_STATUSES: Record<string, CourseStatus> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived"
};

export type TSelectOption = { value: string; text: string };
export const COURSE_SORT_OPTIONS: TSelectOption[] = [
  { value: "Enrollments", text: "Enrollments" },
  { value: "SpotsLeft", text: "Spots Left" },
  { value: "Title", text: "Title" },
];
export type CourseSortOption = "Enrollments" | "SpotsLeft" | "Title";

export interface CourseFitlersType extends FiltersType {
  title?: string;
  status?: CourseStatus;
  categoryId?: string;
  tutorProfileId?: string;
  tagIds?: string[];
}

export type CourseDto = {
  id: string;
  title: string;
  description: string;
  maxCapacity?: number;
  spotsLeft?: number;
  isUserEnrolled?: boolean;
  status?: CourseStatus;
  tutorProfiles?: TutorExtendedProfileDto[];
  category: CategoryDto;
  schedule: ScheduleDto;
  tags?: TagDto[];
  prerequisites?: PrerequisiteDto[];
  createdAt?: string;
};

export type PartialCourseDto = {
  id: string;
  title: string;
};

export type TutorExtendedProfileDto = {
  id: string;
  bio: string;
  expertise: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CategoryDto = {
  id: string;
  name: string;
};

export type CategoryStatsDto = {
  id: string;
  name: string;
  totalCourses: number;
  totalEnrollments: number;
};

export type TagDto = {
  id: string;
  name: string;
};

export type TagStatsDto = {
  id: string;
  name: string;
  totalCourses: number;
  totalEnrollments: number;
};

export type PrerequisiteDto = {
  id: string;
  title: string;
};

export type ScheduleDto = {
  startDate: string;
  endDate: string;
  sessions: ScheduleSessionDto[];
};

export type ScheduleSessionDto = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
};

export interface CreateCourseDto {
  title: string;
  description: string;
  maxCapacity?: number;
  categoryId: string;
  schedule: CreateScheduleDto;
  tagIds: string[];
  prerequisiteIds: string[];
}
type CreateScheduleDto = {
  startDate: string;
  endDate: string;
  sessions: CreateScheduleSessionDto[];
};
type CreateScheduleSessionDto = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
};

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type EnrollmentStatus =
  | "Pending"
  | "Active"
  | "Passed"
  | "Failed"
  | "Suspended"
  | "Dropped";
export const ENROLLMENT_STATUS_LIST = [
  "Pending",
  "Active",
  "Passed",
  "Failed",
  "Suspended",
  "Dropped",
];
export const ENROLLMENT_STATUSES = {
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
}

export type RegisterDto = {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  password: string;
  role: Role;
} & (
  | {
      role: "admin";
    }
  | {
      role: "tutor";
      bio: string;
      expertise: string;
    }
  | {
      role: "student";
      major: string;
    }
);

// Navlinks
type navLink = { text: string; link: string };

const STUDENT_LINKS: navLink[] = [
  { text: "My Enrollments", link: "/" },
  { text: "Discover New", link: "/discover" },
];

const TUTOR_LINKS: navLink[] = [
  { text: "My Courses", link: "/" },
  { text: "Discover New", link: "/discover" },
  { text: "Create Course", link: "/create-course" },
];

const ADMIN_LINKS: navLink[] = [
  { text: "Courses", link: "/courses" },
  { text: "Users", link: "/users" },
  { text: "Categories", link: "/categories" },
  { text: "Tags", link: "/tags" },
  { text: "Platform Analytics", link: "/platfrom-analytics" },
];

export const GUEST_NAV_LINKS: navLink[] = [
  { text: "Register", link: "/register" },
  { text: "Login", link: "/login" },
];

export const USER_NAV_LINKS = {
  student: STUDENT_LINKS,
  tutor: TUTOR_LINKS,
  admin: ADMIN_LINKS,
};
