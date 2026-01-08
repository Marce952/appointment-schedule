'use client'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@heroui/react";
import { Bell } from "lucide-react";
import { signOut } from "next-auth/react";
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
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                }}
                className="transition-transform"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">garridomarcex@gmail.com</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
