"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div className="text-center mt-10">Loading...</div>;
  if (status === "unauthenticated") return null;

  const user = session?.user as { name?: string; email?: string; image?: string; role?: string };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-800 text-center">Profile</h1>
      <div className="flex flex-col items-center gap-4">
        {user?.image && (
          <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full border-2 border-blue-400" />
        )}
        <div className="text-lg font-semibold">{user?.name || user?.email}</div>
        <div className="text-gray-600">{user?.email}</div>
        {user?.role && (
          <span className="mt-1 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">{user.role}</span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 