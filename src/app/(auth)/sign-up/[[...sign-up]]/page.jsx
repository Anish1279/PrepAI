import AuthShell from "@/features/auth/components/AuthShell";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function Page() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Use a strong password. PrepAI stores only a salted password hash and rotates refresh tokens per session."
    >
      <SignUpForm />
    </AuthShell>
  );
}
