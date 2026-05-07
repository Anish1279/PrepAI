"use client"

import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "rgba(6, 78, 59, 0.96)",
          "--error-bg": "rgba(127, 29, 29, 0.96)"
        }
      }
      {...props} />
  );
}

export { Toaster }
