import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-slate-500 border-white/10 focus-visible:border-cyan-300/50 focus-visible:bg-white/[0.075] focus-visible:ring-cyan-300/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-28 w-full rounded-xl border bg-white/[0.055] px-4 py-3 text-base text-slate-100 shadow-inner shadow-black/10 transition-[border-color,background,color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }
