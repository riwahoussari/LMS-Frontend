// types & dtos
export type Role = "admin" | "tutor" | "student";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  TUTOR: "tutor",
};

export type CourseStatus = "Draft" | "Published" | "Archived";

type TSelectOption = { value: string; text: string };
export const COURSE_SORT_OPTIONS: TSelectOption[] = [
  { value: "Enrollments", text: "Enrollments" },
  { value: "SpotsLeft", text: "Spots Left" },
  { value: "Title", text: "Title" },
];

export type CourseDto = {
  id: string;
  title: string;
  description: string;
  maxCapacity?: number;
  spotsLeft?: number;
  isUserEnrolled?: boolean;
  status?: CourseStatus;
  tutorProfiles?: TutorProfileDto[];
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

export type TutorProfileDto = {
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

export type TagDto = {
  id: string;
  name: string;
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
  datOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
};

export type EnrollmentStatus =
  | "Pending"
  | "Active"
  | "Passed"
  | "Failed"
  | "Suspended"
  | "Dropped";
export const ENROLLMENT_STATUS_LIST = ["Pending", "Active", "Passed", "Failed", "Suspended", "Dropped"]

export type EnrollmentDto = {
  course: PartialCourseDto;
  userId: string;
  status: EnrollmentStatus;
};

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
