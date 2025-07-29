"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import StockPredictor from "@/components/StockPredictor";

function UserRoleManager() {
  const { data: session } = useSession();
  // User interface for role management system
  interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => toast.error("Access denied or failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    
    // Polling for real-time updates every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    setUpdatingId(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole }),
    });
    if (res.ok) {
      toast.success(`Role updated to "${newRole}" for ${userEmail}`);
      toast.info("Email notification sent to user");
      fetchUsers();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to update role.");
    }
    setUpdatingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">User Role Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Email</th>
              <th className="text-left py-2 px-3">Name</th>
              <th className="text-left py-2 px-3">Role</th>
              <th className="text-left py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isCurrentUser = user._id === (session?.user as { id?: string })?.id;
              return (
                <tr key={user._id} className={`border-b ${isCurrentUser ? 'bg-blue-50' : ''}`}>
                  <td className="py-2 px-3">{user.email}</td>
                  <td className="py-2 px-3">{user.name}</td>
                  <td className="py-2 px-3 capitalize">
                    {user.role}
                    {isCurrentUser && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                  </td>
                  <td className="py-2 px-3">
                    {!isCurrentUser && user.role !== "admin" && (
                      <button
                        className={`px-2 py-1 bg-blue-500 text-white rounded mr-2 transition-colors duration-200 hover:bg-blue-700 flex items-center justify-center ${updatingId === user._id ? "opacity-70 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleChange(user._id, "admin", user.email)}
                        disabled={updatingId === user._id}
                      >
                        {updatingId === user._id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin mr-2"></span>
                        ) : null}
                        Promote to Admin
                      </button>
                    )}
                    {!isCurrentUser && user.role !== "user" && (
                      <button
                        className={`px-2 py-1 bg-gray-500 text-white rounded transition-colors duration-200 hover:bg-gray-700 flex items-center justify-center ${updatingId === user._id ? "opacity-70 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleChange(user._id, "user", user.email)}
                        disabled={updatingId === user._id}
                      >
                        {updatingId === user._id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-blue-500 rounded-full animate-spin mr-2"></span>
                        ) : null}
                        Demote to User
                      </button>
                    )}
                    {isCurrentUser && (
                      <span className="text-gray-500 text-sm italic">Cannot modify own role</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // Session and navigation setup for dashboard
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Polling for role changes every 30 seconds
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const checkRole = async () => {
        try {
          const res = await fetch("/api/user/role");
          if (res.ok) {
            const data = await res.json();
            if (data.role !== (session?.user as { role?: string })?.role) {
              // Role changed, refresh the page to show updated permissions
              window.location.reload();
            }
          }
        } catch (error) {
          console.error("Error checking role:", error);
        }
      };

      const interval = setInterval(checkRole, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return null;

  const user = session?.user;
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      {isAdmin && <UserRoleManager />}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-4">
            {user?.image ? (
              <Image src={user.image} alt="Profile" width={96} height={96} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-blue-700">{user?.name?.[0] || user?.email?.[0]}</span>
            )}
          </div>
          <div className="text-xl font-bold text-blue-800">{user?.name || user?.email}</div>
          <div className="text-gray-600">{user?.email}</div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-xl font-bold text-green-800">Stock Predictor</div>
          <div className="text-gray-600 text-center">Powered by Brain.js Neural Network</div>
        </div>
      </div>
      
      {/* AI Stock Predictor */}
      <div className="mt-8">
        <StockPredictor />
      </div>
    </div>
  );
}

