'use client'
import { HomeIcon, Bell, X, UserPlus, ClipboardList, ChevronRight, IdCard, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ openMenu, setOpenMenu }: { openMenu?: boolean; setOpenMenu?: (val: boolean) => void }) {

  const pathname = usePathname();

  // Configuración de rutas
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Clientes", href: "/dashboard/clientes", icon: UserPlus },
    { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell },
    { name: "Turnos", href: "/dashboard/turnos", icon: ClipboardList }, // Nueva ruta
    { name: "Tajetas de fidelizacion", href: "/dashboard/tarjetas-fidelizacion", icon: IdCard },
    { name: "Horarios", href: "/dashboard/configuracion/horarios", icon: Clock },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out 
        ${openMenu ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:shadow-md border-r border-gray-100`}
    >
      {/* Header del Sidebar */}
      <div className="p-4 h-16 flex items-center justify-between border-b bg-gray-50/50">
        <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Dr.
        </span>
        <button className="md:hidden p-1 hover:bg-gray-200 rounded-full" onClick={() => setOpenMenu?.(false)}>
          <X size={20} />
        </button>
      </div>

      {/* Navegación Dinámica */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpenMenu?.(false)}
              className={`flex items-center justify-between group p-2.5 rounded-xl transition-all duration-200 ${isActive
                ? "bg-blue-50 text-blue-500 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={`${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"}`} />
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.name}
                </span>
              </div>
              {isActive && <ChevronRight size={14} className="animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer del Sidebar (Opcional) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Sistema de Gestión v2.0</p>
      </div>
    </aside>
  );
}