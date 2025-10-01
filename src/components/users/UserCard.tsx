import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { type Role, type UserDto } from "@/lib/constants/users";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserCard({
  id,
  firstName,
  lastName,
  email,
  birthDate,
  roleName,
  studentProfile,
  tutorProfile,
  suspended,
}: UserDto) {
  return (
    <div className="w-sm rounded-md shadow-md border p-6">
      {/* row 1 */}
      <div>
        {/* role */}
        <div className="flex justify-between mb-4">
          {suspended ? (
            <Badge
              variant={"outline"}
              className="text-red-600 border-red-600 text-base"
            >
              Suspended
            </Badge>
          ) : (
            <div />
          )}

          <Badge
            variant={"outline"}
            className={getRoleBadgeColor(roleName) + " h-8"}
          >
            {roleName}
          </Badge>
        </div>

        {/* fullname - email - birthdate */}
        <Link to={`/users/${id}`} className="hover:underline">
          <p className="text-2xl font-semibold capitalize mb-2">
            {firstName} {lastName}
          </p>
        </Link>
        <p className="opacity-70 line-clamp-3 w-9/10">{email}</p>
        <p className="opacity-70 line-clamp-3 w-9/10 flex items-center gap-1 my-1">
          <Calendar className="w-5 h-5" />
          {birthDate}
        </p>
      </div>

      {/* row 2 */}

      {(tutorProfile?.bio ||
        tutorProfile?.expertise ||
        studentProfile?.major) && (
        <div className="flex justify-between items-center mt-6  border-t pt-6">
          {/* tutor profile info */}
          {tutorProfile && (
            <div>
              <p>Expertise: {tutorProfile.expertise}</p>
            </div>
          )}

          {/* student profile info */}
          {studentProfile && (
            <div>
              <p className="capitalize">Major: {studentProfile.major}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SkeletonUserCard() {
  return (
    <div className="w-2xl rounded-md shadow-md border p-6">
      {/* row 1 */}
      <div>
        {/* role */}
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* fullname - email - birthdate */}
        <Skeleton className="h-10 w-1/2 rounded-full mb-6" />
        <Skeleton className="h-4 w-3/4 mb-2 rounded-full" />
        <Skeleton className="h-4 w-3/4 mb-2 rounded-full" />
      </div>

      {/* row 2 */}
      <div className="flex justify-between items-start mt-6  border-t pt-6">
        <div>
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div>
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  );
}

const getRoleBadgeColor = (role?: Role) => {
  switch (role) {
    case "student":
      return "text-green-600 border-green-600";
    case "tutor":
      return "text-blue-600 border-blue-600";
    case "admin":
      return "text-purple-600 border-purple-600";
    default:
      return "text-gray-600 border-gray-600";
  }
};
