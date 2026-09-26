"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { ShieldCheck, LogOut, Plus, LayoutDashboard } from "lucide-react";

export default function StealthAdminBar() {
  const { isAdmin, logout, openEditModal } = useAdmin();

  if (!isAdmin) return null;

  return (
    <aside aria-label="Stealth Admin Toolbar" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full stealth-admin-bar flex items-center gap-3 sm:gap-4 shadow-2xl transition-all">
      <div className="flex items-center gap-2 pr-2 border-r border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-medium text-white tracking-tight hidden sm:inline">Admin Mode</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin"
          className="text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>

        <button
          onClick={() => openEditModal("project")}
          className="text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Project</span>
        </button>

        <button
          onClick={() => openEditModal("experience")}
          className="text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Experience</span>
          <span className="sm:hidden">Exp</span>
        </button>

        <button
          onClick={() => openEditModal("certificate")}
          className="text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Certificate</span>
          <span className="sm:hidden">Cert</span>
        </button>
      </div>

      <div className="pl-2 border-l border-white/10">
        <button
          onClick={() => logout()}
          title="Exit Admin Mode"
          className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Exit</span>
        </button>
      </div>
    </aside>
  );
}
