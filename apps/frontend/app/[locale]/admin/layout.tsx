"use client";
import React from "react";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import "../globals.css";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  const collapsedWidth = 80;
  const expandedWidth = 256;

  const sidebarWidth = isOpen ? expandedWidth : collapsedWidth;

  const dir =
    typeof document !== "undefined" ? document.documentElement.dir : "ltr";

  return (
    <div>
      <Sidebar />
      <div
        style={{
          [dir === "rtl" ? "marginRight" : "marginLeft"]: `${sidebarWidth}px`,
          transition: "margin 300ms ease",
        }}
        className="min-h-screen"
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
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
