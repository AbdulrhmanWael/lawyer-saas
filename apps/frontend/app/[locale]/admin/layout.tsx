"use client";
import React from "react";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import "../globals.css";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  const pathname = usePathname();
  const isAuthPage = pathname.endsWith("/login");

  const collapsedWidth = 80;
  const expandedWidth = 256;

  const sidebarWidth = isAuthPage ? 0 : isOpen ? expandedWidth : collapsedWidth;

  return (
    <div className="flex min-h-screen relative">
      {!isAuthPage && (
        <div
          style={{
            width: `${sidebarWidth}px`,
            transition: "width 300ms ease",
          }}
          className="fixed inset-y-0 inset-inline-start-0 z-40" // logical: left for LTR, right for RTL
        >
          <Sidebar />
        </div>
      )}

      <div
        style={{
          marginInlineStart: `${sidebarWidth}px`, // logical margin
          transition: "margin 300ms ease",
        }}
        className="flex-1 flex flex-col"
      >
        {!isAuthPage && <Header />}
        <main className="p-6">{children}</main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminShell>{children}</AdminShell>
    </SidebarProvider>
  );
}
