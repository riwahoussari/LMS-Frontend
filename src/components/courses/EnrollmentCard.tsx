import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { type EnrollmentDto } from "@/lib/constants";
import { Button } from "../ui/button";

export default function EnrollmentCard({
  course: { id, title },
  status,
}: EnrollmentDto) {
  return (
    <div className="w-2xl rounded-md shadow-md border p-6">
      <div>
        <p className="text-3xl font-semibold capitalize mb-2">{title}</p>
        <p>Enrollment Status: {status}</p>
      </div>

      <div className="flex justify-between items-start mt-6  border-t pt-6">
        <div>
          <Link to={`/courses/${id}`} className="hover:underline">
            <Button className="rounded-ful text-lg cursor-pointer" size="lg">
              View Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SkeletonEnrollmentCard() {
  return (
    <div className="w-2xl rounded-md shadow-md border p-6">
      <div>
        <Skeleton className="h-10 w-3/4 rounded-full mb-6" />
        <Skeleton className="h-4 w-32 mb-2 rounded-full" />
      </div>

      <div className="flex justify-between items-start mt-6  border-t pt-6">
        <div>
          <Skeleton className="h-12 w-24" />
        </div>
      </div>
    </div>
  );
}
