"use client"

import { ChevronLeftIcon } from "lucide-react";

import { ThemeButton } from "@/components/theme-button";
import { Button } from "@/components/ui/button";

interface StandaloneLayoutProps {
  children: React.ReactNode;
};

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-background/10 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Button variant="primary" onClick={() => window.history.back()}>
            <ChevronLeftIcon />Back
          </Button>
          <div className="flex gap-4">
            <ThemeButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">{children}</div>
      </div>
    </main>
  );
}

export default StandaloneLayout;
