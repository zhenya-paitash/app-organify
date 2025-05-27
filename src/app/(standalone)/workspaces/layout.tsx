import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";

interface StandaloneLayoutProps {
  children: React.ReactNode;
};

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-background/10 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">Organify</Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}

export default StandaloneLayout;
