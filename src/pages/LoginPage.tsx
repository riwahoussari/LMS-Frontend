import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password is required."),
});
const defaultValues = {
  email: "",
  password: "",
};

type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
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
    <>
      <AuthFormWrapper title="login">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
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

            {/* Error Message */}
            {errors.root && (
              <div className="text-sm text-red-500 text-center">
                {errors.root.message}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </AuthFormWrapper>
    </>
  );
}
