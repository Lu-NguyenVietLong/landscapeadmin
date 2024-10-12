"use client";
import Button from "@/components/primitive/Button";
import useAuth from "@/packages/hook/useAuth";
import { cn } from "@/utils/helpers";
import { MENU } from "@/utils/routes";
import { map } from "lodash";
import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="h-[200px] mt-4 mb-4">
      <div className="bg-white w-full h-[50%] shadow-box rounded-lg flex items-center justify-between px-8">
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
      <div className="flex lg:hidden">
        {map(MENU, (item, index) => (
          <div key={index}>
            <Link
              className={cn(
                "py-3 block font-semibold text-primary-second px-2 rounded-lg",
                {
                  "text-primary bg-primary/20": pathname === item.route,
                }
              )}
              href={item.route}
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
