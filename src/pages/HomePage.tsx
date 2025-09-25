import { useAuth } from "@/context/AuthContext"
import { ROLES } from "@/lib/constants";
import { Navigate } from "react-router-dom";

export default function HomePage() 
{
    const {user} = useAuth();

    if (user?.role == ROLES.STUDENT )  return <StudentHomePage />
    if (user?.role == ROLES.TUTOR) return <TutorHomePage />
    return <Navigate to="/unauthorized" replace />;
}

function StudentHomePage() {
    return <h1>Student home page</h1>
}

function TutorHomePage() {
    return <h1>Tutor home page</h1>
}