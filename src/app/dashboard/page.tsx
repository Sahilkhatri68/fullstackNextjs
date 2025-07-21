"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session?.user?.name ?? session?.user?.email}!
      </h1>
      <p>This is your dashboard page. Only logged-in users can access this.</p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
