import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { getCourse } from "@/services/courses";

import HeaderSection from "@/components/courses/CoursePageSections/HeaderSection";
import ScheduleSection from "@/components/courses/CoursePageSections/ScheduleSection";
import EnrollmentSection from "@/components/courses/CoursePageSections/EnrollmentSection";
import PrerequisitesSection from "@/components/courses/CoursePageSections/PrerequisitesSection";
import EnrolledStudentsSection from "@/components/courses/CoursePageSections/EnrolledStudentsSection";
import TutorsSection from "@/components/courses/CoursePageSections/TutorsSection";
import TagsSection from "@/components/courses/CoursePageSections/TagsSection";
import CourseInfoSection from "@/components/courses/CoursePageSections/CourseInfoSection";
import { useAuth } from "@/context/AuthContext";
import { ROLES, type CourseDto } from "@/lib/constants";
import CourseStatusSection from "@/components/courses/CoursePageSections/CourseStatusSection";
import { useEffect, useState } from "react";
import BackButton from "@/components/shared/BackButton";
import ErrorCard from "@/components/shared/ErrorCard";

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDto | null>(null);

  const { data, error, loading } = useCachedAsync(
    `getCourse-${courseId}`,
    getCourse,
    [courseId || ""],
    [courseId]
  );

  useEffect(() => {
    setCourse(data);
  }, [data]);

  var isTutor = user && user.role === ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course?.tutorProfiles?.some((tp) => tp.userId === user?.sub);
  var isAdmin = user && user.role === ROLES.ADMIN;
  const isStudent = user?.role == ROLES.STUDENT;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-32 " />
          <Skeleton className="h-64 " />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <ErrorCard
        title="Course Not Found."
        message="The course you're looking for doesn't exist or couldn't be loaded."
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <BackButton />

      {/* Header */}
      <HeaderSection course={course} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isStudent && <EnrollmentSection course={course} />}
          <ScheduleSection course={course} />
          <PrerequisitesSection course={course} />
          {(isAssignedTutor || isAdmin) && (
            <EnrolledStudentsSection course={course} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {(isAdmin || isAssignedTutor) && (
            <CourseStatusSection onUpdate={setCourse} course={course} />
          )}
          <TutorsSection isAssignedTutor={isAssignedTutor} course={course} />
          <TagsSection course={course} />
          <CourseInfoSection course={course} />
        </div>
      </div>
    </div>
  );
}
