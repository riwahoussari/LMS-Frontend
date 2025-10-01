import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CategoriesSelect from "@/components/forms/CategoriesSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import TagsMultiSelect from "@/components/forms/TagsMultiSelect";
import CoursesMultiSelect from "@/components/forms/CoursesMultiSelect";
import { getCourse, updateCourse } from "@/services/courses";
import {
  COURSE_STATUSES,
  type CourseDto,
  type UpdateCourseDto,
} from "@/lib/constants/courses";
import { ROLES } from "@/lib/constants/users";
import { DAYS_OF_WEEK } from "@/lib/constants/others";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { toast } from "sonner";
import LoadingDiv from "@/components/shared/LoadingDiv";
import BackButton from "@/components/shared/BackButton";
import ErrorCard from "@/components/shared/ErrorCard";

const courseSessionSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (hh:mm)"
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (hh:mm)"
      ),
    location: z.string().min(1, "Location is required"),
  })
  .refine(
    (data) => {
      const start = new Date(`2000-01-01T${data.startTime}`);
      const end = new Date(`2000-01-01T${data.endTime}`);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const courseScheduleSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-mm-dd)"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (yyyy-mm-dd)"),
    sessions: z
      .array(courseSessionSchema)
      .min(1, "At least one session is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // Check for overlapping sessions on the same day
      const sessionsGroupedByDay = data.sessions.reduce((acc, session) => {
        if (!acc[session.dayOfWeek]) {
          acc[session.dayOfWeek] = [];
        }
        acc[session.dayOfWeek].push(session);
        return acc;
      }, {} as Record<number, typeof data.sessions>);

      // Check each day for overlaps
      for (const dayOfWeek in sessionsGroupedByDay) {
        const daySessions = sessionsGroupedByDay[dayOfWeek];

        for (let i = 0; i < daySessions.length; i++) {
          for (let j = i + 1; j < daySessions.length; j++) {
            const session1 = daySessions[i];
            const session2 = daySessions[j];

            const start1 = new Date(`2000-01-01T${session1.startTime}`);
            const end1 = new Date(`2000-01-01T${session1.endTime}`);
            const start2 = new Date(`2000-01-01T${session2.startTime}`);
            const end2 = new Date(`2000-01-01T${session2.endTime}`);

            // Check if sessions overlap
            if (start1 < end2 && start2 < end1) {
              return false;
            }
          }
        }
      }
      return true;
    },
    {
      message: "Sessions on the same day cannot overlap",
      path: ["sessions"],
    }
  );

const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  maxCapacity: z.number().min(0, "Max Capacity cannot be negative"),
  categoryId: z.string().min(1, "Category ID is required"),
  schedule: courseScheduleSchema,
  tagIds: z.array(z.string()),
  prerequisiteIds: z.array(z.string()),
});

type FormFields = z.infer<typeof createCourseSchema>;

const getDayName = (dayOfWeek: number): string => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[dayOfWeek] || "Invalid Day";
};

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDto | null>(null);

  // load course
  const { data, error, loading, clearCacheKey } = useCachedAsync(
    `getCourse-${courseId}`,
    getCourse,
    [courseId || ""],
    [courseId]
  );
  const isDraft = course?.status === COURSE_STATUSES.DRAFT;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load course info");
    }
  }, [error]);

  useEffect(() => {
    setCourse(data);
  }, [data]);

  // Validate User
  var isTutor = user && user.role === ROLES.TUTOR;
  var isAssignedTutor =
    isTutor && course?.tutorProfiles?.some((tp) => tp.userId === user?.sub);

  // Initialize Form
  const form = useForm<FormFields>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      maxCapacity: 0,
      categoryId: "",
      schedule: {
        startDate: "",
        endDate: "",
        sessions: [],
      },
      tagIds: [],
      prerequisiteIds: [],
    },
  });

  // set default values when course is loaded
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title,
        description: course.description,
        maxCapacity: course.maxCapacity,
        categoryId: course.category.id,
        schedule: {
          startDate: course.schedule.startDate,
          endDate: course.schedule.endDate,
          sessions: course.schedule.sessions.map((sess) => ({
            ...sess,
            startTime: sess.startTime.slice(0, 5),
            endTime: sess.endTime.slice(0, 5),
            dayOfWeek: DAYS_OF_WEEK.indexOf(sess.dayOfWeek),
          })),
        },
        tagIds: course.tags?.map((tag) => tag.id) || [],
        prerequisiteIds: course.prerequisites?.map((p) => p.id) || [],
      });
    }
  }, [course, form]);

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule.sessions",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!course) return;
    try {
      await updateCourse(course.id, data as UpdateCourseDto);
      toast.success("Course Updated");
      clearCacheKey(`getCourse-${courseId}`);
      navigate(-1);
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error instanceof AxiosError && error.response) {
        const { data: responseData } = error.response;
        errorMessage = responseData ? responseData : errorMessage;
      } else if (error instanceof AxiosError && error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError("root", { message: errorMessage });
    }
  };

  const addSession = () => {
    append({
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "10:00",
      location: "",
    });
  };

  if (loading) return <LoadingDiv />;
  if (!isAssignedTutor || error) return;
  if (!course) {
    return (
      <ErrorCard
        title="Failed to load Course."
        message="The course you're looking for didn't load or doesn't exist."
      />
    );
  }
  if (course.status === COURSE_STATUSES.ARCHIVED) {
    return (
      <ErrorCard
        title="Not Allowed"
        message="Cannot edit an Archived course."
      />
    );
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackButton />
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center capitalize">
              Edit Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                {isDraft && (
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Title</Label>
                        <Input type="text" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Description</Label>
                      <Textarea {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Capacity */}
                <FormField
                  control={control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Max Capacity</Label>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <FormDescription>
                        (0 means no max capacity)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                {isDraft && (
                  <FormField
                    control={control}
                    name="categoryId"
                    render={(field) => (
                      <FormItem>
                        <CategoriesSelect
                          categoryId={field.field.value}
                          setCategoryId={field.field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Tags */}
                <FormField
                  control={control}
                  name="tagIds"
                  render={(field) => (
                    <FormItem>
                      <TagsMultiSelect
                        tagIds={field.field.value}
                        setTagIds={field.field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prerequisistes */}
                {isDraft && (
                  <FormField
                    control={control}
                    name="prerequisiteIds"
                    render={(field) => (
                      <FormItem>
                        <CoursesMultiSelect
                          label="Prerequisites"
                          selectedCourseIds={field.field.value}
                          onCoursesChange={field.field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="my-16 w-full h-[1px] bg-foreground/10" />

                {/* Date Range */}
                {isDraft && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <FormField
                      control={control}
                      name="schedule.startDate"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Start Date</Label>
                          <Input type="date" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date */}
                    <FormField
                      control={control}
                      name="schedule.endDate"
                      render={({ field }) => (
                        <FormItem>
                          <Label>End Date</Label>
                          <Input type="date" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Sessions */}
                {isDraft && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Sessions</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSession}
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Session
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <Card
                        key={field.id}
                        className="p-4 border-l-4 border-l-blue-500"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Session {index + 1}</h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>

                          {/* Day of Week */}
                          <FormField
                            control={control}
                            name={`schedule.sessions.${index}.dayOfWeek`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Day of Week</Label>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(parseInt(value))
                                  }
                                  value={field.value.toString()}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                      <SelectItem
                                        key={day}
                                        value={day.toString()}
                                      >
                                        {getDayName(day)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Time Range */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={control}
                              name={`schedule.sessions.${index}.startTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Start Time</Label>
                                  <Input type="time" {...field} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`schedule.sessions.${index}.endTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>End Time</Label>
                                  <Input type="time" {...field} />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Location */}
                          <FormField
                            control={control}
                            name={`schedule.sessions.${index}.location`}
                            render={({ field }) => (
                              <FormItem>
                                <Label>Location</Label>
                                <Input
                                  type="text"
                                  placeholder="Room 101, Building A"
                                  {...field}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}

                    {/* Sessions validation error */}
                    {errors.schedule?.sessions?.root && (
                      <div className="text-sm text-red-500">
                        {errors.schedule.sessions.root.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {errors.root && (
                  <div className="text-sm text-red-500 text-center">
                    {errors.root.message}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating Course..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
