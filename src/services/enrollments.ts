import type { EnrollmentDto } from "@/lib/constants";
import { api } from "./api";

export async function getMyEnrollments(filters: any): Promise<EnrollmentDto[]> {
  const res = await api.get<EnrollmentDto[]>("/enrollments/my-enrollments", { params: filters });
  return res.data;
}