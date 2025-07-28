"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  // State management for login form
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Invalid email or password", {
        autoClose: 1500,
        transition: Bounce,
      });
    } else {
      toast.success("Login successful", {
        onClose: () => router.push("/dashboard"),
        autoClose: 1500,
        transition: Bounce,
      });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold transition-colors ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={async () => {
                setGoogleLoading(true);
                await signIn("google", { callbackUrl: "/dashboard" });
                setGoogleLoading(false);
              }}
              disabled={googleLoading}
              className={`w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded font-semibold shadow-sm hover:bg-gray-50 transition-colors mt-4 relative ${googleLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <span className="flex items-center">
                {/* Inline Google G SVG icon */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.19 3.23l6.85-6.85C36.68 2.09 30.74 0 24 0 14.82 0 6.73 5.08 2.69 12.44l7.99 6.2C13.01 13.16 18.13 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/>
                    <path fill="#FBBC05" d="M10.68 28.64A14.5 14.5 0 0 1 9.5 24c0-1.62.28-3.19.78-4.64l-7.99-6.2A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.49 10.48l8.19-5.84z"/>
                    <path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.19-5.59c-2.01 1.35-4.59 2.15-8.7 2.15-5.87 0-10.99-3.66-13.32-8.86l-8.19 5.84C6.73 42.92 14.82 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </g>
                </svg>
                {googleLoading ? (
                  <span className="ml-2 animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full inline-block align-middle"></span>
                ) : null}
                <span className="ml-2">Sign in with Google</span>
              </span>
            </button>
            
          </form>

          <p className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
