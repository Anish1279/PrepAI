import Link from "next/link";
import { Suspense } from "react";
import AuthShell from "@/features/auth/components/AuthShell";
import SignInForm from "@/features/auth/components/SignInForm";

export default function Page() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your PrepAI account"
      footer={
        <>
          New to PrepAI?{" "}
          <Link href="/sign-up" className="font-medium text-cyan-200 hover:text-cyan-100">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
