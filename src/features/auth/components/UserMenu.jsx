"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const UserMenu = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (active) {
          setUser(payload?.data?.user ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "x-csrf-token": getCookie("prepai_csrf"),
        },
      });

      if (!response.ok) {
        throw new Error("Could not sign out.");
      }

      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right md:block">
        <p className="text-sm font-medium text-slate-100">{user?.name ?? "Account"}</p>
        <p className="max-w-[180px] truncate text-xs text-slate-500">{user?.email}</p>
      </div>
      <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cyan-200">
        <UserRound className="h-4 w-4" />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={logout}
        disabled={loading}
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] ?? "";
}

export default UserMenu;
