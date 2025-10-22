"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export function LogoutLink({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    return signOut({ redirect: false }).then(() => {
      router.push("/");
    });
  };

  return (
    <button
      type="button"
      className={`${className} cursor-pointer`}
      onClick={() => {
        toast.promise(handleLogout(), {
          loading: "Logging out...",
          success: "You have successfully logged out.",
          error: "Logout failed. Please try again.",
        });
      }}
    >
      {children}
    </button>
  );
}
