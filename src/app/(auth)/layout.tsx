"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ThemeButton } from "@/components/theme-button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Readonly<AuthLayoutProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  const handleNavigationClick = () => router.push(isLogin ? "/register" : "/login");

  return (
    // <main className="grid grid-cols-1 md:grid-cols-[1fr_minmax(25%,480px)] min-h-screen overflow-hidden relative">
    <main className="grid grid-cols-1 md:grid-cols-[1fr_minmax(25%,480px)] min-h-screen overflow-hidden relative bg-gradient-to-t from-primary/10">
      <div className="absolute inset-0 bg-noise-light bg-repeat bg-auto filter invert opacity-50 dark:opacity-25 dark:filter-none pointer-events-none z-0" />

      <div className="relative hidden md:block rounded-md m-2 z-10">
        <video className="absolute inset-0 w-full h-full object-cover shadow-lg rounded-[inherit]" src="/intro.webm" autoPlay loop muted playsInline />
      </div>

      <div className="flex flex-col overflow-y-auto min-w-[25%] p-2 z-10">
        <nav className="flex items-center justify-between gap-2">
          <ThemeButton />
          <Button variant="secondary" onClick={handleNavigationClick}>{isLogin ? "Sign Up" : "Login"}</Button>
        </nav>
        <div className="flex flex-1 flex-col justify-center items-center w-full p-2">{children}</div>
      </div>
    </main>
  );
}
