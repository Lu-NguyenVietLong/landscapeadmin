"use client";
import Button from "@/components/primitive/Button";
import useAuth from "@/packages/hook/useAuth";
import { Bell, LogOut } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="h-[64px] mt-4 mb-4">
      <div className="bg-white size-full shadow-box rounded-lg flex items-center justify-between px-8">
        <h2 className="text-lg flex gap-2">
          Wellcome <p className="text-primary">{user?.name}</p>
        </h2>
        <div className="flex items-center gap-5">
          <div className="cursor-pointer hover:text-primary">
            <Bell />
          </div>
          <Button
            onClick={() => logout()}
            className="cursor-pointer flex-center gap-2 hover:text-primary-lighter"
          >
            <LogOut />
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
