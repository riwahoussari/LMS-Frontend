export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  TUTOR: "tutor",
};

// types
export type Role = "admin" | "tutor" | "student";

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
