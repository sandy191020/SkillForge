"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, FileText, Map, Award, Sparkles, Code, Trophy, Linkedin, Briefcase, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Interview Assistant",
    href: "/dashboard/interview",
    icon: Brain,
  },
  {
    title: "Resume Analyzer",
    href: "/resume",
    icon: FileText,
  },
  {
    title: "Roadmap Maker",
    href: "/roadmap",
    icon: Map,
  },
  {
    title: "DSA Dojo",
    href: "/dsa-dojo",
    icon: Code,
  },
  {
    title: "Game Box",
    href: "/game-box",
    icon: Trophy,
  },
  {
    title: "Portfolio Maker",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    title: "LinkedIn Optimizer",
    href: "/linkedin",
    icon: Linkedin,
  },
  {
    title: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-lg">SkillForge</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
