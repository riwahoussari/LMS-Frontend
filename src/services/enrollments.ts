import {
  ENROLLMENT_STATUSES,
  type EnrollmentDto,
  type EnrollmentStatus,
  type ExtendedEnrollmentDto,
} from "@/lib/constants";
import { api } from "./api";

export async function getMyEnrollments(filters: {
  enrollmentStatus?: EnrollmentStatus;
}): Promise<EnrollmentDto[]> {
  const res = await api.get<EnrollmentDto[]>("/enrollments/my-enrollments", {
    params: filters,
  });
  return res.data;
}

export async function getStudentEnrollments(filters: {
  enrollmentStatus?: EnrollmentStatus;
  studentProfileId: string;
}): Promise<EnrollmentDto[]> {
  const res = await api.get<EnrollmentDto[]>("/enrollments", {
    params: filters,
  });
  return res.data;
}

export async function getCourseEnrollments(courseId: string) {
  const res = await api.get<ExtendedEnrollmentDto[]>(
    `/courses/${courseId}/enrollments`
  );
  return res.data;
}

export async function getSingleEnrollment(
  courseId: string,
  studentProfileId: string
) {
  const res = await api.get<EnrollmentDto>(
    `/courses/${courseId}/enrollments/${studentProfileId}`
  );
  return res.data;
}

// post
export async function enrollIntoCourse({ courseId }: { courseId: string }) {
  const res = await api.post<EnrollmentDto>(`/courses/${courseId}/enrollments`);
  return res.data;
}

// update
export async function reEnrollIntoCourse({
  courseId,
  studentProfileId,
}: {
  courseId: string;
  studentProfileId: string;
}) {
  const res = await api.patch<EnrollmentDto>(
    `/courses/${courseId}/enrollments/${studentProfileId}`,
    { status: ENROLLMENT_STATUSES.PENDING }
  );
  return res.data;
}

export async function dropCourse({
  courseId,
  studentProfileId,
}: {
  courseId: string;
  studentProfileId: string;
}) {
  const res = await api.patch<EnrollmentDto>(
    `/courses/${courseId}/enrollments/${studentProfileId}`,
    { status: ENROLLMENT_STATUSES.DROPPED }
  );
  return res.data;
}

export async function updateEnrollmentStatus({
  courseId,
  studentProfileId,
  newStatus,
}: {
  courseId: string;
  studentProfileId: string;
  newStatus: string;
}) {
  const res = await api.patch<EnrollmentDto>(
    `/courses/${courseId}/enrollments/${studentProfileId}`,
    { status: newStatus }
  );
  return res.data;
}
