"use client";

import { useEffect, useState } from "react";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { getUser, updateUser, toggleSuspendUser } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ErrorCard from "@/components/shared/ErrorCard";
import LoadingDiv from "@/components/shared/LoadingDiv";
import { ROLES, type UpdateUserDto, type UserDto } from "@/lib/constants";
import NotFoundPage from "../auth/NotFoundPage";
import { StudentEnrollments, TutorCourses } from "../HomePage";
import PageTitle from "@/components/ui/custom/PageTitle";

export default function UserPage() {
  const { userId: requestedId } = useParams();
  const { user } = useAuth();
  const [requestedUser, setRequestedUser] = useState<UserDto | null>(null);
  const {
    data: fullUser,
    loading,
    clearCacheKey,
  } = useCachedAsync(
    `getUser-${requestedId}`,
    getUser,
    [requestedId || ""],
    [requestedId],
    {
      enabled: !!requestedId,
    }
  );

  useEffect(() => {
    setRequestedUser(fullUser);
  }, [fullUser]);

  if (!user) return <NotFoundPage />;
  if (loading) return <LoadingDiv />;
  if (!requestedId || !requestedUser)
    return (
      <ErrorCard
        title="User Not Found"
        message="The user you were looking for was not found"
      />
    );

  const isSelf = user.sub == requestedId;
  const isStudent = user.role == ROLES.STUDENT;
  const isAdmin = user.role == ROLES.ADMIN;
  const isTargetAdmin = requestedUser.roleName == ROLES.ADMIN;
  const isTargetTutor = requestedUser.roleName == ROLES.TUTOR;
  const isTargetStudent = requestedUser.roleName == ROLES.STUDENT;

  // 🚨 Access control
  // no-one can see admins - only the admin himself
  if (isTargetAdmin && !isSelf) {
    return (
      <ErrorCard
        title="User Not Found"
        message="The user you were looking for was not found"
      />
    );
  }
  // students can't see other students
  if (requestedUser.roleName == ROLES.STUDENT && isStudent && !isSelf) {
    return (
      <ErrorCard
        title="User Not Found"
        message="The user you were looking for was not found"
      />
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6">
      <UserInfo
        requestedUser={requestedUser}
        setRequestedUser={setRequestedUser}
        onUpdate={() => {
          clearCacheKey("getUsers");
          clearCacheKey(`getUser-${requestedId}`);
        }}
      />

      {!isSelf && isTargetTutor && (
        <div className="space-y-6 mt-20">
          <p className="font-bold text-3xl pb-5 border-b-2">
            Courses By This Tutor
          </p>
          <TutorCourses showStatus={!isStudent} userId={requestedId} />
        </div>
      )}

      {isAdmin && isTargetStudent && requestedUser.studentProfile && (
        <div className="space-y-6 mt-20">
          <p className="font-bold text-3xl pb-5 border-b-2">
            Student Enrollments
          </p>
          <StudentEnrollments
            studentProfileId={requestedUser.studentProfile.id}
          />
        </div>
      )}
    </main>
  );
}

function UserInfo({
  requestedUser,
  setRequestedUser,
  onUpdate,
}: {
  requestedUser: UserDto;
  setRequestedUser: React.Dispatch<React.SetStateAction<UserDto | null>>;
  onUpdate: () => void;
}) {
  const { user } = useAuth();
  const isSelf = user?.sub == requestedUser.id;
  const isAdmin = user?.role == ROLES.ADMIN;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: "",
    lastName: "",
    birthDate: "",
    major: "",
    expertise: "",
    bio: "",
  });

  const updateRequestedUserState = (formData: UpdateUserDto) => {
    setRequestedUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        firstName: !!formData.firstName ? formData.firstName : prev.firstName,
        lastName: !!formData.lastName ? formData.lastName : prev.lastName,
        birthDate: !!formData.birthDate ? formData.birthDate : prev.birthDate,
        tutorProfile:
          prev.tutorProfile === undefined
            ? prev.tutorProfile
            : {
                ...prev.tutorProfile,
                bio: !!formData.bio ? formData.bio : prev.tutorProfile?.bio,
                expertise: !!formData.expertise
                  ? formData.expertise
                  : prev.tutorProfile?.expertise,
              },
        studentProfile:
          prev.studentProfile === undefined
            ? prev.studentProfile
            : {
                ...prev.studentProfile,
                major: !!formData.major
                  ? formData.major
                  : prev.studentProfile?.major,
              },
      };
    });
  };

  const handleUpdate = async () => {
    try {
      await updateUser(formData);
      toast.success("Profile updated");
      onUpdate();
      setIsEditOpen(false);
      updateRequestedUserState(formData);
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const handleSuspendToggle = async () => {
    try {
      await toggleSuspendUser(requestedUser.id, !requestedUser.suspended);
      toast.success(
        requestedUser.suspended ? "User unsuspended" : "User suspended"
      );
      onUpdate();
      setRequestedUser((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          suspended: !prev.suspended,
        };
      });
    } catch (e) {
      toast.error("Failed to update user suspension");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8 shadow-lg border rounded-2xl">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {requestedUser.firstName} {requestedUser.lastName}
          </h2>
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              requestedUser.suspended
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {requestedUser.suspended ? "Suspended" : "Active"}
          </span>
        </div>

        {/* General Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{requestedUser.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Birth Date</p>
            <p className="font-medium">{requestedUser.birthDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{requestedUser.roleName}</p>
          </div>
          {requestedUser.studentProfile && (
            <div>
              <p className="text-sm text-muted-foreground">Major</p>
              <p className="font-medium">
                {requestedUser.studentProfile.major}
              </p>
            </div>
          )}
        </div>

        {/* Tutor Profile Info */}
        {requestedUser.tutorProfile && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold">Tutor Profile</h3>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="font-medium">{requestedUser.tutorProfile.bio}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expertise</p>
              <p className="font-medium">
                {requestedUser.tutorProfile.expertise}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {isSelf && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Input
                    placeholder="First Name"
                    defaultValue={requestedUser.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Last Name"
                    defaultValue={requestedUser.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Birth Date"
                    type="date"
                    defaultValue={requestedUser.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                  {requestedUser.studentProfile && (
                    <Input
                      placeholder="Major"
                      defaultValue={requestedUser.studentProfile.major}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          major: e.target.value,
                        })
                      }
                    />
                  )}
                  {requestedUser.tutorProfile && (
                    <>
                      <Textarea
                        placeholder="Bio"
                        defaultValue={requestedUser.tutorProfile.bio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bio: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Expertise"
                        defaultValue={requestedUser.tutorProfile.expertise}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expertise: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
                  <Button onClick={handleUpdate}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {isAdmin && !isSelf && (
            <Button
              variant={requestedUser.suspended ? "secondary" : "destructive"}
              onClick={handleSuspendToggle}
            >
              {requestedUser.suspended ? "Unsuspend User" : "Suspend User"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
