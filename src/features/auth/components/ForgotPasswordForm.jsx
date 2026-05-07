"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import AuthField from "@/features/auth/components/AuthField";
import { forgotPasswordSchema } from "@/features/auth/validators/auth-schemas";

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    try {
      const result = await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: values,
      });

      toast.success("If that email exists, a reset link has been prepared.");

      if (result.resetToken) {
        toast.info(`Dev reset token: ${result.resetToken}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not request reset.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full" variant="premium">
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-cyan-200 hover:text-cyan-100">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
