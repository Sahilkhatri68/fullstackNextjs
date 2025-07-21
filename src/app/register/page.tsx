"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed.");
        return;
      }

      toast.success("Registration successful! Redirecting...", {
        onClose: () => router.push("/login"),
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
