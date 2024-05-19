import { MENU } from "@/utils/routes";
import { map } from "lodash";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <div className="">
      <ul className="mt-5">
        {map(MENU, (item, index) => (
          <li key={item.route}>
            <Link
              className={cn(
                "pr-2 py-3 block font-semibold hover:text-primary",
                {
                  "text-primary": pathname === item.route,
                }
              )}
              href={item.route}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
