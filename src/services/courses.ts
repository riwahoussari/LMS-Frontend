import {
  type CourseDto,
  type CourseFitlersType,
  type CreateCourseDto,
  type PagedResult,
  type UpdateCourseDto,
} from "@/lib/constants";
import { api } from "./api";

// read 
export async function getCourses(
  filters: CourseFitlersType
): Promise<PagedResult<CourseDto>> {
  const res = await api.get<PagedResult<CourseDto>>("/courses", {
    params: filters,
    paramsSerializer: { indexes: null },
  });
  return res.data;
}

export async function getCourse(id: string): Promise<CourseDto> {
  const res = await api.get<CourseDto>(`/courses/${id}`);
  return res.data;
}

// create
export async function createCourse(data: CreateCourseDto): Promise<CourseDto> {
  const res = await api.post<CourseDto>("/courses", data);
  return res.data;
}

// update
export async function updateCourse(id:string, data: UpdateCourseDto): Promise<CourseDto> {
  const res = await api.put<CourseDto>(`/courses/${id}`, data);
  return res.data;
}

export async function publishCourse(id: string): Promise<CourseDto> {
  const res = await api.patch<CourseDto>(`/courses/${id}/publish`);
  return res.data;
}

// delete
export async function archiveCourse(id: string): Promise<CourseDto> {
  const res = await api.delete<CourseDto>(`/courses/${id}`);
  return res.data;
}
