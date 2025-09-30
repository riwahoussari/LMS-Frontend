import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COURSE_STATUSES, type CourseStatus } from "@/lib/constants";

export function CourseStatusSelect({
  status,
  setStatus,
}: {
  status: CourseStatus | undefined;
  setStatus: React.Dispatch<React.SetStateAction<CourseStatus | undefined>>;
}) {
  return (
    <div>
      <Label>
        <p className="opacity-80 ms-1 mb-1">Course Status</p>
      </Label>
      <Select value={status} onValueChange={v => setStatus(v as CourseStatus)}>
        <SelectTrigger>
          <SelectValue placeholder="Course Status" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(COURSE_STATUSES).map((k) => (
            <SelectItem key={k} value={COURSE_STATUSES[k]}>
              {COURSE_STATUSES[k]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
