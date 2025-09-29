import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { ENROLLMENT_STATUSES, ROLES, type CourseDto } from "@/lib/constants";
import { getMyEnrollments } from "@/services/enrollments";
import { BookOpen, CheckCircle, Circle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrerequisitesSection({ course }: { course: CourseDto }) {
  const { user } = useAuth();
  const isStudent = user?.role == ROLES.STUDENT;

  const { data: myEnrollments } = useCachedAsync(
    `getMy${ENROLLMENT_STATUSES.PASSED}Enrollments`,
    getMyEnrollments,
    [{ enrollmentStatus: ENROLLMENT_STATUSES.PASSED }],
    [],
    { enabled: isStudent }
  );

  if (!course.prerequisites || course.prerequisites.length == 0) return;

  const updatePrerequisites = course.prerequisites.map((prereq) => {
    return {
      ...prereq,
      userPassed: myEnrollments?.some((e) => e.course.id == prereq.id),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Prerequisites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {updatePrerequisites.map((prerequisite) => (
            <Link
              to={`/courses/${prerequisite.id}`}
              key={prerequisite.id}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded cursor-pointer hover:brightness-125"
            >
              {isStudent && prerequisite.userPassed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-yellow-600" />
              )}
              <span>{prerequisite.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}