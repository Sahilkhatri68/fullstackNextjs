import "./globals.css";
import { ReactNode } from "react";
import NavbarSidebar from "../components/NavbarSidebar";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "MERN Full-Stack App",
  description: "A production-grade web application using Next.js 15",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        <ClientLayout>
          <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
            <NavbarSidebar />
          </header>
          <main className="p-6 flex-1 mt-20">{children}</main>
          <footer className="mt-auto bg-white p-4 text-center text-sm border-t">
            &copy; 2025 MERN Full-Stack Tutorial
          </footer>
        </ClientLayout>
      </body>
    </html>
  );
}
