import { Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Panel de control</h1>
      <div className="flex items-center gap-3">
        <div className="relative cursor-pointer">
          <Link href="/dashboard/notificaciones" className="text-gray-600 hover:text-blue-600">
            <Bell />

            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-[10px] font-bold text-white flex justify-center items-center">99</div>
          </Link>
        </div>

        <div className="flex flex-col-reverse justify-center items-center">
          <span className="text-sm text-gray-600">Marce Garrido</span>
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-8 h-8 rounded-full border"
          />
        </div>
      </div>
    </header>
  );
}
