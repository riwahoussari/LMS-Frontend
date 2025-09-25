import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

export default function AuthFormWrapper({
  title,
  children,
}: {
  title: "login" | "register";
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center capitalize">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* form goes here */}
          {children}

          <p className="mt-4 text-center text-sm">
            {title === "register"
              ? "Already have an account? "
              : "Don't have an accout? "}
            <Link
              to={title === "register" ? "/login" : "/register"}
              className="text-blue-400 hover:underline"
            >
              {title === "register" ? " Login here" : " Register here"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}