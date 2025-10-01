import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseDto } from "@/lib/constants";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function TutorsSection({ course }: { course: CourseDto }) {
  if (!course.tutorProfiles || course.tutorProfiles.length === 0) return;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {course.tutorProfiles.map((tutor) => (
          <div key={tutor.id} className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <Link className="hover:underline" to={`/users/${tutor.userId}`}>
                <h4 className="font-medium">
                  {tutor.firstName} {tutor.lastName}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{tutor.email}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}