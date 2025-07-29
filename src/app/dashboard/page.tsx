"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const earningsHistory = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 950 },
  { month: "Mar", earnings: 1800 },
  { month: "Apr", earnings: 2100 },
  { month: "May", earnings: 1600 },
  { month: "Jun", earnings: 2300 },
];

const predictionData = [
  { symbol: "AAPL", prediction: "+5.2%" },
  { symbol: "GOOGL", prediction: "+2.8%" },
  { symbol: "AMZN", prediction: "-1.1%" },
  { symbol: "TSLA", prediction: "+3.7%" },
  { symbol: "MSFT", prediction: "+0.9%" },
];

const newStocks = [
  { symbol: "NVDA", price: 950.12, change: "+2.3%" },
  { symbol: "NFLX", price: 420.55, change: "-0.7%" },
  { symbol: "META", price: 310.22, change: "+1.5%" },
];

const earningsBarData = {
  labels: earningsHistory.map((e) => e.month),
  datasets: [
    {
      label: "Earnings ($)",
      data: earningsHistory.map((e) => e.earnings),
      backgroundColor: "#6366f1",
      borderRadius: 8,
    },
  ],
};

const earningsBarOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Past 6 Months Earnings", font: { size: 18 } },
  },
};

const predictionDoughnutData = {
  labels: predictionData.map((p) => p.symbol),
  datasets: [
    {
      label: "Prediction %",
      data: predictionData.map((p) => parseFloat(p.prediction)),
      backgroundColor: ["#10b981", "#3b82f6", "#f59e42", "#ef4444", "#6366f1"],
    },
  ],
};

const predictionDoughnutOptions = {
  plugins: {
    legend: { position: 'bottom' as const },
    title: { display: true, text: "Stock Predictions (Next Month)", font: { size: 18 } },
  },
};

const newStockLineData = {
  labels: newStocks.map((s) => s.symbol),
  datasets: [
    {
      label: "Price ($)",
      data: newStocks.map((s) => s.price),
      borderColor: "#f59e42",
      backgroundColor: "rgba(245,158,66,0.1)",
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: "#f59e42",
    },
  ],
};

const newStockLineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "New Stock Prices", font: { size: 18 } },
  },
};

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
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <Bar data={earningsBarData} options={earningsBarOptions} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <Doughnut data={predictionDoughnutData} options={predictionDoughnutOptions} />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <Line data={newStockLineData} options={newStockLineOptions} />
        </div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">New Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newStocks.map((stock) => (
            <div key={stock.symbol} className="border rounded-lg p-4 flex flex-col items-center bg-white">
              <span className="text-2xl font-bold text-indigo-800">{stock.symbol}</span>
              <span className="text-lg mt-2">${stock.price.toLocaleString()}</span>
              <span className={`mt-1 text-sm font-semibold ${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{stock.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

