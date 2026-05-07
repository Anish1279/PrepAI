import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-12">
        <section className="relative hidden overflow-hidden bg-slate-950 lg:col-span-5 lg:block xl:col-span-6">
          <Image
            src="/PrepAI_login.png"
            alt="PrepAI interview preparation illustration"
            fill
            priority
            sizes="50vw"
            className="object-contain object-center"
          />

        </section>

        <section className="flex items-center justify-center px-6 py-10 lg:col-span-7 xl:col-span-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-white">
                <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <Sparkles className="size-5" />
                </span>
                <span>PrepAI</span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Secure mock interviews, coding rounds, and preparation workflows in one place.
              </p>
              <h1 className="mt-6 text-3xl font-semibold text-white">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthShell;
