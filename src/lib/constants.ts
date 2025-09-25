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

// Navlinks
type navLink = { text: string; link: string };

const STUDENT_LINKS: navLink[] = [
  { text: "My Courses", link: "/" },
  { text: "Discover New", link: "/discover" },
];

const TUTOR_LINKS: navLink[] = [
  { text: "My Courses", link: "/" },
  { text: "Discover New", link: "/favorites" },
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

