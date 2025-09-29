import type { CourseDto, CourseFitlersType, CreateCourseDto, PagedResult } from "@/lib/constants";
import { api } from "./api";

export async function getCourses(filters: CourseFitlersType): Promise<PagedResult<CourseDto>> {
  const res = await api.get<PagedResult<CourseDto>>("/courses", { params: filters, paramsSerializer: {indexes: null} });
  return res.data;
}

export async function getCourse(id: string): Promise<CourseDto> {
  const res = await api.get<CourseDto>(`/courses/${id}`);
  return res.data;
}

export async function createCourse(data: CreateCourseDto): Promise<CourseDto> {
  const res = await api.post<CourseDto>("/courses", data);
  return res.data;
}


