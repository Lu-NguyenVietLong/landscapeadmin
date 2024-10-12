"use client";
import { Button as AntButton, Menu as AntMenu } from "antd";
import useAuth from "@/packages/hook/useAuth";
import { cn } from "@/utils/helpers";
import { MENU } from "@/utils/routes";
import { Bell, LogOut, Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [current, setCurrent] = useState(pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="mt-4 mb-4">
      <div className="bg-white w-full h-[64px] shadow-box rounded-lg flex items-center justify-between px-8 flex-wrap relative">
        {/* Mobile menu button (hamburger icon) */}
        <div className="md:hidden block">
          <AntButton
            className="text-primary"
            icon={<MenuIcon />}
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="w-full md:hidden flex flex-col bg-white shadow-lg rounded-lg mt-2 absolute top-full z-10">
            <AntMenu
              onClick={handleClick}
              selectedKeys={[current]}
              mode="vertical"
              className="w-full"
              items={MENU.map((item) => ({
                key: item.route,
                label: (
                  <Link
                    href={item.route}
                    className={cn("py-2 block px-3 rounded-lg", {
                      "text-primary bg-primary/20": pathname === item.route,
                    })}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  >
                    {item.title}
                  </Link>
                ),
              }))}
            />
          </div>
        )}

        {/* Desktop menu */}
        <div className="hidden md:flex w-full justify-between items-center">
          <AntMenu
            onClick={handleClick}
            selectedKeys={[current]}
            mode="horizontal"
            className="flex-1"
            items={MENU.map((item) => ({
              key: item.route,
              label: (
                <Link
                  href={item.route}
                  className={cn("py-1 block px-3 rounded-lg", {
                    "text-primary bg-primary/20": pathname === item.route,
                  })}
                >
                  {item.title}
                </Link>
              ),
            }))}
          />
          <div className="flex items-center gap-5">
            <div className="cursor-pointer hover:text-primary">
              <Bell />
            </div>
            <AntButton
              onClick={() => logout()}
              className="cursor-pointer flex items-center gap-2 hover:text-primary-lighter"
              icon={<LogOut />}
            >
              Đăng xuất
            </AntButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
