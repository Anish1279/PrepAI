"use client";

import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const CodingErrorState = ({
  title = "Could not load coding round",
  message = "Something went wrong. Please try again.",
  actionHref = "/dashboard",
  actionLabel = "Go to Dashboard",
}) => {
  useEffect(() => {
    if (message) {
      toast.error(message);
    }
  }, [message]);

  return (
    <div className="surface-panel rounded-3xl p-8">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-200">
        <AlertTriangle className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-slate-400">{message}</p>
      <Button asChild className="mt-6" variant="premium">
        <Link href={actionHref}>
          <Home className="size-4" />
          {actionLabel}
        </Link>
      </Button>
    </div>
  );
};

export default CodingErrorState;
