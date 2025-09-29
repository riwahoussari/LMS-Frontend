import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingDiv from "./LoadingDiv";
import NotFoundPage from "@/pages/auth/NotFoundPage";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { isLoading, isAuth, user } = useAuth();

  if (isLoading) {
    return <LoadingDiv />;
  }

  if (!isAuth) return <Navigate to="/login" replace />;
  if (roles && (!user || !roles.includes(user.role))) return <NotFoundPage />;

  return <>{children}</>;
}
