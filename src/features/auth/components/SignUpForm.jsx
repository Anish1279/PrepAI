"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import AuthField from "@/features/auth/components/AuthField";
import { signupSchema } from "@/features/auth/validators/auth-schemas";

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const result = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: values,
      });

      if (result.verificationToken) {
        toast.info("Dev verification token generated in the API response/logs.");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create account.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthField
        label="Name"
        type="text"
        autoComplete="name"
        error={errors.name}
        {...register("name")}
      />
      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email}
        {...register("email")}
      />
      <AuthField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password}
        {...register("password")}
      />

      <p className="text-xs leading-5 text-slate-500">
        Use at least 12 characters with uppercase, lowercase, a number, and a symbol.
      </p>

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full" variant="premium">
        {isSubmitting ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Creating account
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-cyan-200 hover:text-cyan-100">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
