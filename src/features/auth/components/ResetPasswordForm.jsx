"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import AuthField from "@/features/auth/components/AuthField";
import { resetPasswordSchema } from "@/features/auth/validators/auth-schemas";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await apiRequest("/api/auth/reset-password", {
        method: "POST",
        body: values,
      });

      toast.success("Password reset successfully. Please sign in.");
      router.replace("/sign-in");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthField
        label="Reset token"
        type="text"
        autoComplete="off"
        error={errors.token}
        {...register("token")}
      />
      <AuthField
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.password}
        {...register("password")}
      />

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full" variant="premium">
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Resetting password
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
