"use client";
import { HomeIcon, Calendar, } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 text-xl font-bold border-b">Mi Sistema</div>
      <nav className="flex-1 p-4 space-y-3">
        <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600">
          <HomeIcon size={18} /> Dashboard
        </Link>
        <Link href="/dashboard/turnos" className="flex items-center gap-2 hover:text-blue-600">
          <Calendar size={18} /> Turnos
        </Link>
      </nav>
    </aside>
  );
}
