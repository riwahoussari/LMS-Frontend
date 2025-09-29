import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseDto } from "@/lib/constants";
import { Info } from "lucide-react";

export default function CourseInfoSection({ course }: { course: CourseDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Course Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Max Capacity</span>
          <span className="font-medium">
            {course.maxCapacity ? course.maxCapacity : "Unlimited"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Spots Available</span>
          <span className="font-medium">
            {course.maxCapacity ? course.spotsLeft : "Unlimited"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="secondary">{course.category.name}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}