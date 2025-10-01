import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseDto } from "@/lib/constants/courses";
import { Separator } from "@radix-ui/react-select";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function ScheduleSection({ course }: { course: CourseDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Start Date
            </label>
            <p className="text-lg">
              {format(new Date(course.schedule.startDate), "PPP")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              End Date
            </label>
            <p className="text-lg">
              {format(new Date(course.schedule.endDate), "PPP")}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-3">Sessions</h4>
          <div className="space-y-3">
            {course.schedule.sessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">{session.dayOfWeek}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {session.startTime} - {session.endTime}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {session.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
