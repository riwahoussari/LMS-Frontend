import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { getPlatformAnalytics } from "@/services/analytics";
import { toast } from "sonner";

export type AnalyticsResponse = {
  users: {
    totalUsers: number;
    totalAdmins: number;
    totalTutors: number;
    totalStudents: number;
    growthLast30Days: { date: string; count: number }[];
  };
  courses: {
    totalCourses: number;
    published: number;
    draft: number;
    archived: number;
    avgCapacityUtilizationPct: number;
    globalCompletionRatePct: number;
    topCoursesByEnrollment: {
      courseId: string;
      title: string;
      enrollments: number;
    }[];
  };
  tutors: {
    totalTutors: number;
    topTutorsByEnrollments: {
      tutorId: string;
      tutorName: string;
      coursesCount: number;
      totalEnrollments: number;
    }[];
  };
  students: {
    totalStudents: number;
    avgActiveEnrollmentsPerStudent: number;
    dropoutRatePct: number;
    passRatePct: number;
  };
};

export default function PlatformAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setData(await getPlatformAnalytics());
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        toast.error("Failed to load platform analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-10">No data available</div>;
  }

  return (
    <div className="p-6 grid gap-6">
      {/* USERS OVERVIEW */}
      <Card>
        <CardHeader>
          <CardTitle>Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm">Total</p>
              <p className="text-xl font-bold">{data.users.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm">Admins</p>
              <p className="text-xl font-bold">{data.users.totalAdmins}</p>
            </div>
            <div>
              <p className="text-sm">Tutors</p>
              <p className="text-xl font-bold">{data.users.totalTutors}</p>
            </div>
            <div>
              <p className="text-sm">Students</p>
              <p className="text-xl font-bold">{data.users.totalStudents}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.users.growthLast30Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string | number | Date) =>
                  new Date(d).toLocaleDateString()
                }
              />
              <YAxis />
              <div className="text-background!">
                <Tooltip
                  labelStyle={{ color: "var(--color-foreground)" }}
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    boxShadow:
                      "0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
                  }}
                />
              </div>
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* COURSES OVERVIEW */}
      <Card>
        <CardHeader>
          <CardTitle>Courses Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm">Total</p>
              <p className="text-xl font-bold">{data.courses.totalCourses}</p>
            </div>
            <div>
              <p className="text-sm">Published</p>
              <p className="text-xl font-bold">{data.courses.published}</p>
            </div>
            <div>
              <p className="text-sm">Draft</p>
              <p className="text-xl font-bold">{data.courses.draft}</p>
            </div>
            <div>
              <p className="text-sm">Archived</p>
              <p className="text-xl font-bold">{data.courses.archived}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.courses.topCoursesByEnrollment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip
                labelStyle={{ color: "var(--color-foreground)" }}
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  boxShadow:
                    "0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
                }}
              />
              <Bar dataKey="enrollments" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TUTORS */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tutors by Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.tutors.topTutorsByEnrollments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tutorName" />
              <YAxis />
              <Tooltip
                labelStyle={{ color: "var(--color-foreground)" }}
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  boxShadow:
                    "0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
                }}
              />
              <Bar dataKey="totalEnrollments" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* STUDENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm">Total</p>
            <p className="text-xl font-bold">{data.students.totalStudents}</p>
          </div>
          <div>
            <p className="text-sm">Avg Active Enrollments</p>
            <p className="text-xl font-bold">
              {data.students.avgActiveEnrollmentsPerStudent}
            </p>
          </div>
          <div>
            <p className="text-sm">Dropout Rate</p>
            <p className="text-xl font-bold">{data.students.dropoutRatePct}%</p>
          </div>
          <div>
            <p className="text-sm">Pass Rate</p>
            <p className="text-xl font-bold">{data.students.passRatePct}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
