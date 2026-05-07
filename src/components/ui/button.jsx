import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-cyan-300/20 bg-cyan-300 text-slate-950 shadow-[0_12px_40px_rgba(34,211,238,0.18)] hover:bg-cyan-200 hover:shadow-[0_18px_55px_rgba(34,211,238,0.25)]",
        destructive:
          "border border-red-300/20 bg-red-500 text-white shadow-[0_14px_45px_rgba(239,68,68,0.22)] hover:bg-red-400 focus-visible:ring-destructive/30",
        outline:
          "border border-white/12 bg-white/[0.04] text-slate-100 shadow-sm hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100",
        secondary:
          "border border-white/10 bg-white/[0.075] text-slate-100 shadow-sm hover:border-white/18 hover:bg-white/[0.11]",
        ghost:
          "text-slate-300 hover:bg-white/[0.075] hover:text-white",
        link: "text-cyan-200 underline-offset-4 hover:text-cyan-100 hover:underline",
        premium:
          "border border-cyan-200/20 bg-[linear-gradient(135deg,#67e8f9,#6ee7b7)] text-slate-950 shadow-[0_18px_55px_rgba(34,211,238,0.24)] hover:shadow-[0_22px_65px_rgba(52,211,153,0.28)]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 text-base has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
