import type { FiltersType, TSelectOption } from "./others";

// Roles
export type Role = "admin" | "tutor" | "student";
export const ROLES: Record<string, Role> = {
  ADMIN: "admin",
  STUDENT: "student",
  TUTOR: "tutor",
};

// Users
export type UserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: Role;
  birthDate?: string;
  suspended?: boolean;
  studentProfile?: StudentProfileDto;
  tutorProfile?: TutorProfileDto;
};
export type PartialUserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  bio?: string;
  expertise?: string;

  major?: string;
};


// Students
export type StudentProfileDto = {
  id: string;
  major: string;
};

// Tutors
export type TutorProfileDto = {
  id: string;
  bio: string;
  expertise: string;
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

// Filters
export interface UserFiltersType extends FiltersType {
  role?: Role;
  fullName?: string;
  email?: string;
}

// Sorting
export type UserSortOption = "Age" | "FirstName" | "LastName";
export const USER_SORT_OPTIONS: TSelectOption[] = [
  { value: "Age", text: "Age" },
  { value: "FirstName", text: "First Name" },
  { value: "LastName", text: "Last Name" },
];