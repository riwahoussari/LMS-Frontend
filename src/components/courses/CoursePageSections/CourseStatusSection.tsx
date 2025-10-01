import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import {
  COURSE_STATUSES,
  type CourseDto,
  type CourseStatus,
} from "@/lib/constants/courses";
import { ROLES } from "@/lib/constants/users";
import { archiveCourse, publishCourse } from "@/services/courses";
import axios from "axios";
import { User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CourseStatusSection({
  course,
  onUpdate,
}: {
  course: CourseDto;
  onUpdate: React.Dispatch<React.SetStateAction<CourseDto | null>>;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role == ROLES.ADMIN;
  const isTutor = user?.role == ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course?.tutorProfiles?.some((tp) => tp.userId === user?.sub);

  const [options, setOptions] = useState(
    getCourseStatusOptions(course.status, isAdmin)
  );

  const { clearCacheKey } = useCachedAsync("", async () => null, [], [], {
    enabled: false,
  });

  const handleChange = async (value: string) => {
    if (!course) return;
    if (!isAdmin && !isAssignedTutor) return;

    setOptions([]);
    try {
      if (value == COURSE_STATUSES.PUBLISHED) await publishCourse(course.id);
      else if (value == COURSE_STATUSES.ARCHIVED)
        await archiveCourse(course.id);
      else throw new Error("Invalid Status");

      onUpdate({ ...course, status: value as CourseStatus });
      setOptions(getCourseStatusOptions(value as CourseStatus, isAdmin));
      clearCacheKey(`getCourse-${course.id}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Failed to update course status.", {
          description: err.response.data,
        });
      else toast.error("Failed to update course status.");
      setOptions(getCourseStatusOptions(course.status, isAdmin));
    }
  };

  if (!course.status) return;
  if (!isAdmin && !isAssignedTutor) return;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Course Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          defaultValue={course.status}
          value={course.status}
          disabled={options.length == 0}
          onValueChange={handleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {course.status && <SelectItem value={course.status}>{course.status}</SelectItem>}
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

export const getCourseStatusOptions = (
  status: CourseStatus | undefined,
  isAdmin: boolean
): string[] => {
  let options: string[] = [];

  switch (status) {
    case COURSE_STATUSES.DRAFT:
      if (isAdmin) {
        options = [COURSE_STATUSES.PUBLISHED, COURSE_STATUSES.ARCHIVED];
      } else {
        options = [COURSE_STATUSES.ARCHIVED];
      }
      break;

    case COURSE_STATUSES.PUBLISHED:
      options = [COURSE_STATUSES.ARCHIVED];
      break;

    case COURSE_STATUSES.ARCHIVED:
      if (isAdmin) {
        options = [COURSE_STATUSES.PUBLISHED];
      }
      break;

    default:
      options = [];
  }

  return options;
};
