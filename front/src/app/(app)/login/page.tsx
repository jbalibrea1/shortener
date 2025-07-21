import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { auth } from "../../../auth";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(85vh)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </main>
  );
}
