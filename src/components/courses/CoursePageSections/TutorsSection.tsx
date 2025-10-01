import TutorsSelect from "@/components/forms/TutorsSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseDto, TutorExtendedProfileDto } from "@/lib/constants";
import { assignTutor, unassignTutor } from "@/services/courses";
import axios from "axios";
import { Plus, User, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function TutorsSection({
  course,
  isAssignedTutor,
}: {
  course: CourseDto;
  isAssignedTutor: boolean;
}) {
  return isAssignedTutor ? (
    <EditableSection course={course} />
  ) : (
    <ReadOnlySection course={course} />
  );
}

function ReadOnlySection({ course }: { course: CourseDto }) {
  if (!course.tutorProfiles) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {course.tutorProfiles.length === 0 && (
          <p className="text-muted-foreground">No tutors assigned yet.</p>
        )}
        {course.tutorProfiles.map((tutor) => (
          <div key={tutor.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Link className="hover:underline" to={`/users/${tutor.userId}`}>
                <h4 className="font-medium">
                  {tutor.firstName} {tutor.lastName}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{tutor.email}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EditableSection({ course }: { course: CourseDto }) {
  const [tutors, setTutors] = useState(course.tutorProfiles ?? []);
  const [newTutorId, setNewTutorId] = useState("");
  const [newTutorProfileId, setNewTutorProfileId] = useState("");

  if (!tutors) return null;

  const handleUnassign = async (tutorId: string) => {
    try {
      await unassignTutor(course.id, { tutorId });

      setTutors((prev) => prev.filter((t) => t.id !== tutorId));
      toast.success("Tutor unassigned successfully");

      window.location.reload();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Failed to unassign tutor.", {
          description: err.response.data,
        });
      else toast.error("Failed to unassign tutor");
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!newTutorId) return;

    try {
      const res = await assignTutor(course.id, { tutorId: newTutorId });

      const assignedTutor: TutorExtendedProfileDto = res.tutorProfiles?.find(
        (tp) => tp.userId == newTutorId
      ) || {
        id: newTutorProfileId,
        userId: newTutorId,
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        expertise: "",
      };

      setTutors((prev) => [...prev, assignedTutor]);
      setNewTutorId("");
      toast.success("Tutor assigned successfully");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data)
        toast.error("Failed to assign tutor.", {
          description: err.response.data,
        });
      else toast.error("Failed to assign tutor");
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Instructors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tutors.length === 0 && (
          <p className="text-muted-foreground">No tutors assigned yet.</p>
        )}
        {tutors.map((tutor) => (
          <div key={tutor.id} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Link className="hover:underline" to={`/users/${tutor.userId}`}>
                <h4 className="font-medium">
                  {tutor.firstName} {tutor.lastName}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground">{tutor.email}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleUnassign(tutor.userId)}
            >
              {" "}
              Unassign
            </Button>
          </div>
        ))}

        {/* Assign new tutor */}
        <div className="flex items-center gap-2">
          <TutorsSelect
            tutorProfileId={newTutorProfileId}
            setTutorProfileId={setNewTutorProfileId}
            setTutorUserId={setNewTutorId}
          />
          <Button
            variant={"outline"}
            onClick={handleAssign}
            disabled={!newTutorId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
