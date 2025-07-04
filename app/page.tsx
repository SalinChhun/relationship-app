"use client";
import { useEffect } from "react";
import { getCurrentUserFromLocalStorage } from "@/utils/auth";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUserFromLocalStorage<User>();

    if (user) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
  );
}
