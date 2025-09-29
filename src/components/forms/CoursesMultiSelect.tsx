import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search, CheckCircle, Circle } from "lucide-react";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { getCourses } from "@/services/courses";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface CoursesMultiSelectProps {
  label?: string;
  selectedCourseIds: string[];
  onCoursesChange: (courses: string[]) => void;
  placeholder?: string;
}

export default function CoursesMultiSelect({
  label,
  selectedCourseIds,
  onCoursesChange,
  placeholder = "Search for courses...",
}: CoursesMultiSelectProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // Fetch courses based on search
  const { data: courseList, error } = useCachedAsync(
    `getCourses-${searchValue}`,
    getCourses,
    [{ title: searchValue, limit: 10, offset: 0 }],
    [searchValue]
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load courses");
    }
  }, [error]);

  const courses = courseList?.items || [];

  const toggleCourse = (course: Course) => {
    const isSelected = selectedCourses.some((c) => c.id === course.id);

    if (isSelected) {
      // Remove course
      removeCourse(course.id);
    } else {
      // Add course
      onCoursesChange([...selectedCourseIds, course.id]);
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeCourse = (courseId: string) => {
    onCoursesChange(selectedCourseIds.filter((id) => id !== courseId));
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const clearAll = () => {
    onCoursesChange([]);
    setSelectedCourses([]);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <Label>
          <p className="opacity-80 ms-1 mb-2">{label}</p>
        </Label>
      )}

      {/* Selected Courses Badges */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-sm font-medium">
            Selected ({selectedCourses.length})
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto p-1 text-xs"
            type="button"
          >
            Clear all
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          {selectedCourses.map((course) => (
            <Badge
              key={course.id}
              variant="secondary"
              className="flex items-center gap-1 py-1 px-2"
            >
              <span className="truncate max-w-[200px]">{course.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCourse(course.id)}
                className="h-auto p-0 ml-1 hover:bg-transparent"
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card className="absolute z-50 w-full max-w-md mt-1 shadow-lg py-0">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {courses.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No courses found
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {courses.map((course) => {
                    const isSelected = selectedCourses.some(
                      (c) => c.id === course.id
                    );
                    return (
                      <div
                        key={course.id}
                        className={`
                          flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                          ${
                            isSelected
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          }
                        `}
                        onClick={() => toggleCourse(course)}
                      >
                        {/* Selection Indicator */}
                        {isSelected ? (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}

                        {/* Course Info */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium truncate ${
                              isSelected ? "text-primary" : ""
                            }`}
                          >
                            {course.title}
                          </h4>
                          {course.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {courses.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                  type="button"
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
