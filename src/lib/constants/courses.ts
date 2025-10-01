import type { FiltersType, TSelectOption } from "./others";
import type { TutorExtendedProfileDto } from "./users";

// Course
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
  prerequisites?: PartialCourseDto[];
  createdAt?: string;
};
export type PartialCourseDto = {
  id: string;
  title: string;
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
export interface UpdateCourseDto {
  title: string;
  description: string;
  maxCapacity?: number;
  categoryId: string;
  schedule: CreateScheduleDto;
  tagIds: string[];
  prerequisiteIds: string[];
}

// Status
export type CourseStatus = "Draft" | "Published" | "Archived";
export const COURSE_STATUSES: Record<string, CourseStatus> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

// Categories
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

// Tags
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

// Schedules
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

// Filters
export interface CourseFitlersType extends FiltersType {
  title?: string;
  status?: CourseStatus;
  categoryId?: string;
  tutorProfileId?: string;
  tagIds?: string[];
}

// Sorting
export type CourseSortOption = "Enrollments" | "SpotsLeft" | "Title";
export const COURSE_SORT_OPTIONS: TSelectOption[] = [
  { value: "Enrollments", text: "Enrollments" },
  { value: "SpotsLeft", text: "Spots Left" },
  { value: "Title", text: "Title" },
];
