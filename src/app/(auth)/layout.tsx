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
    <main className="grid grid-cols-1 md:grid-cols-[1fr_minmax(25%,480px)] min-h-screen overflow-hidden relative bg-gradient-to-t from-secondary/10">
      <div className="absolute inset-0 bg-noise-light bg-repeat bg-auto filter invert opacity-40 dark:opacity-20 dark:filter-none pointer-events-none z-0" />

      <div className="relative hidden md:block rounded-md m-2 z-10" data-cursor-scale={3} data-cursor-color="hsl(var(--secondary))">
        <div className="absolute p-4 inset-0 bg-primary/95 font-heading text-secondary rounded-[inherit] z-[5]">
          <h1 className="text-2xl md:text-5xl lg:text-8xl font-bold leading-[0.85] tracking([-0.04em])">Welcome to Organify</h1>
          <p className="text-secondary/75 text-sm md:text-lg lg:text-4xl max-w-none md:max-w-[80%] xl:max-w-[60%] py-8">Organify is a <span className="text-secondary">time management tool</span> designed <span className="text-secondary">for developers</span> and <span className="text-secondary">IT teams</span>. It enables users to <span className="text-secondary">track</span>, <span className="text-secondary">analyze</span>, and <span className="text-secondary">optimize</span> the time spent on tasks, facilitating efficient workflow organization.</p>
        </div>
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
