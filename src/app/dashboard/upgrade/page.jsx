import React from "react";
import PricingPlan from "@/constants/pricing-plan";
import { requireCurrentUser } from "@/features/auth/services/session-service";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

const Upgrade = async () => {
  const user = await requireCurrentUser();

  return (
    <main className="space-y-8">
      <section className="surface-panel rounded-3xl p-6 text-center sm:p-8">
        <span className="eyebrow">
          <Sparkles className="size-4" />
          Testing mode checkout
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold leading-tight text-white">
          Upgrade your preparation cadence.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
          Choose the rhythm that fits your interview timeline and keep your prep loops moving.
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PricingPlan.map((item, index) => (
            <div
              key={item.duration}
              className="premium-card interactive-lift rounded-3xl p-6 sm:p-8"
            >
              <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                <p className="page-kicker">{index === 0 ? "Flexible" : "Best value"}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {item.duration}
                  <span className="sr-only">Plan</span>
                </h2>
                </div>
                <span className="status-pill">{index === 0 ? "Monthly" : "Annual"}</span>
              </div>

                <p className="mt-2 sm:mt-4">
                  <strong className="text-4xl font-semibold text-white sm:text-5xl">
                    ${item.price}
                  </strong>

                  <span className="ml-2 text-sm font-medium text-slate-400">
                    / {item.duration}
                  </span>
                </p>

              <ul className="mt-8 space-y-3">
                {["Unlimited mock interview loops", "Coding round feedback", "Question bank generation", "Secure account workspace"].map((feature) => (
                  <li className="flex items-center gap-3 text-sm text-slate-300" key={feature}>
                    <CheckCircle2 className="size-5 text-emerald-200" />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`${item.link}?prefilled_email=${encodeURIComponent(user.email)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300 px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_55px_rgba(34,211,238,0.2)] transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/35"
              >
                Get Started
                <ArrowUpRight className="size-4" />
              </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Upgrade;
