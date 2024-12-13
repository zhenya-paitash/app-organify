"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrent } from "@/features/auth/api/use-current";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/api/use-logout";

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent()
  const logout = useLogout()

  useEffect(() => {
    if (!data && !isLoading) router.push("/login");
  }, [data]);

  const handleLogout = () => {
    logout.mutate()
  }

  if (isLoading) return;
  return (
    <>
      <Button onClick={handleLogout}>Loggout</Button>
      {data && <p>{data.name}</p>}
    </>
  );
}
