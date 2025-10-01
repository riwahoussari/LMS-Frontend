import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/lib/constants/users";
import { COURSE_STATUSES, type CourseDto } from "@/lib/constants/courses";
import { getCourseStatusColor, getCourseStatusIcon } from "@/lib/courseUtils";
import { format } from "date-fns";
import { BookOpen, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeaderSection({ course }: { course: CourseDto }) {
  const { user } = useAuth();

  var isTutor = user && user.role == ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course.tutorProfiles?.some((tp) => tp.userId === user?.sub);
  var isAdmin = user && user.role == ROLES.ADMIN;
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {/* Title */}
              <CardTitle className="text-3xl">{course.title}</CardTitle>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              {/* Status */}
              {course.status && (isAdmin || isAssignedTutor) && (
                <Badge
                  className={`${getCourseStatusColor(
                    course.status
                  )} flex items-center gap-1`}
                >
                  {getCourseStatusIcon(course.status)}
                  {course.status}
                </Badge>
              )}
              {/* Category */}
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {course.category.name}
              </span>
              {/* Created At */}
              {course.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {format(new Date(course.createdAt), "MMM dd, yyyy")}
                </span>
              )}
            </div>
          </div>

          <div className="text-right space-y-2">
            {/* Spots Left */}
            {!!course.maxCapacity && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{course.spotsLeft} spots left</span>
              </div>
            )}

            {/* Edit Button */}
            {isAssignedTutor && course.status !== COURSE_STATUSES.ARCHIVED && (
              <Link to={`/courses/${course.id}/edit`}>
                <Button className="cursor-pointer">Edit Course</Button>
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Description */}
        <p className="text-lg leading-relaxed opacity-80">
          {course.description}
        </p>
      </CardContent>
    </Card>
  );
}
