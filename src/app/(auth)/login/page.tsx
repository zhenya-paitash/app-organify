import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";

import { LoginCard } from "@/features/auth/components/login-card";

const LoginPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");

  return (
    <LoginCard />
  );
}

export default LoginPage;
