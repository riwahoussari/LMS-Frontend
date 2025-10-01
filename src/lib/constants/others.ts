export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Filters
export type FiltersType = {
  sortBy?: string;
  sortAsc?: boolean;
  limit?: number;
  offset?: number;
};

// Sorting
export type TSelectOption = { value: string; text: string };

// API Search Result
export type PagedResult<T> = {
  items: T[];
  total: number;
  limit?: number;
  offset?: number;
};

// Nav Links
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
