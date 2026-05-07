import AuthShell from "@/features/auth/components/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email. If an account exists, a short-lived reset token will be issued."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
