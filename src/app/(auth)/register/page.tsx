import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";

import { RegisterCard } from "@/features/auth/components/register-card";

const RegisterPage = async () => {
  const user = await getCurrent();
  if (user) redirect("/");

  return (
    <RegisterCard />
  );
}

export default RegisterPage;
