"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpenCheck,
  ChevronsUp,
  LayoutDashboard,
  Menu,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import UserMenu from "@/features/auth/components/UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/questions", label: "Questions", icon: BookOpenCheck },
  { href: "/dashboard/upgrade", label: "Upgrade", icon: ChevronsUp },
  { href: "/dashboard/howit", label: "How it works", icon: Workflow },
];

function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/72 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
          aria-label="PrepAI dashboard"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.14)]">
            <Sparkles className="size-5" />
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">PrepAI</p>
            <p className="text-xs text-slate-500">Interview workspace</p>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.045] p-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
                mobile
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ item, active, mobile = false, onClick }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
        active && "bg-white text-slate-950 shadow-[0_12px_35px_rgba(255,255,255,0.12)] hover:bg-white hover:text-slate-950",
        mobile && "justify-start rounded-xl px-3"
      )}
    >
      <Icon className="size-4" />
      <span>{item.label}</span>
    </Link>
  );
}

function isActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname?.startsWith(href);
}

export default Header;
