import { useAuth } from "@/context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import PageTitle from "@/components/ui/custom/PageTitle";
import { Navigate } from "react-router-dom";
import TutorCourses from "@/components/courses/TutorCourses";
import StudentEnrollments from "@/components/enrollments/StudentEnrollments";
import { ROLES } from "@/lib/constants/users";

export default function HomePage() {
  const { user } = useAuth();

  if (user?.role == ROLES.STUDENT)
    return (
      <main>
        <PageTitle>My Enrollments</PageTitle>
        <StudentEnrollments />
      </main>
    );
  if (user?.role == ROLES.TUTOR)
    return (
      <main>
        <PageTitle>My Courses</PageTitle>
        <TutorCourses showStatus={true} userId={user.sub} />
      </main>
    );
  if (user?.role == ROLES.ADMIN) return <Navigate to={"/courses"} />;
  return <NotFoundPage />;
}
