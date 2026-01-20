"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-6 bg-card">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>SF</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
