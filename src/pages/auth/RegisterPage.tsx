import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import { useState } from "react";
import { ROLES, type RegisterDto } from "@/lib/constants/users";

// Create a dynamic schema based on role
const createSchema = (isAdmin: boolean = false) => {
  const baseSchema = z.object({
    email: z.email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    birthdate: z.string().min(1, "Birthdate is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/(?=.*\d)/, "Password must contain at least one digit")
      .regex(
        /(?=.*[^\w\s])/,
        "Password must contain at least one special character"
      ),
    role: z.enum(
      isAdmin
        ? [ROLES.ADMIN, ROLES.TUTOR, ROLES.STUDENT]
        : [ROLES.TUTOR, ROLES.STUDENT],
      {
        error: "Please select valid a role",
      }
    ),
  });

  return baseSchema.and(
    z.discriminatedUnion("role", [
      z.object({
        role: z.literal(ROLES.ADMIN),
      }),
      z.object({
        role: z.literal(ROLES.TUTOR),
        bio: z.string().min(1, "Bio is required"),
        expertise: z.string().min(1, "Expertise is required"),
      }),
      z.object({
        role: z.literal(ROLES.STUDENT),
        major: z.string().min(1, "Major is required"),
      }),
    ])
  );
};

type FormFields = z.infer<ReturnType<typeof createSchema>>;

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const isCurrentUserAdmin = user?.role === ROLES.ADMIN;
  const schema = createSchema(isCurrentUserAdmin);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      birthdate: "",
      password: "",
      role: "",
      bio: "",
      expertise: "",
      major: "",
    } as any,
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

  // Watch the role to conditionally show fields
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await register(data as RegisterDto);
      navigate("/");
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

  return (
    <AuthFormWrapper title="register">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label>First Name</Label>
                <Input type="text" placeholder="John" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label>Last Name</Label>
                <Input type="text" placeholder="Doe" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Birthdate */}
          <FormField
            control={control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <Label>Birthdate</Label>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label>Role</Label>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setSelectedRole(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLES.STUDENT}>Student</SelectItem>
                    <SelectItem value={ROLES.TUTOR}>Tutor</SelectItem>
                    {isCurrentUserAdmin && (
                      <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <FormMessage>{errors.role.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Conditional Fields for Tutor */}
          {selectedRole === ROLES.TUTOR && (
            <>
              <FormField
                control={control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <Label>Bio</Label>
                    <Textarea
                      placeholder="Tell us about yourself and your teaching experience..."
                      className="min-h-[100px]"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <Label>Areas of Expertise</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Mathematics, Physics, Computer Science"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Conditional Field for Student */}
          {selectedRole === ROLES.STUDENT && (
            <FormField
              control={control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <Label>Major</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science, Engineering"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Error Message */}
          {errors.root && (
            <div className="text-sm text-red-500 text-center">
              {errors.root.message}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
