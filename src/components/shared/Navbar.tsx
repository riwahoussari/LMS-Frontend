import { Link, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { GUEST_NAV_LINKS, USER_NAV_LINKS } from "@/lib/constants/others";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BurgerMenuSvg from "@/components/ui/custom/BurgerMenuSvg";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCachedAsync } from "@/hooks/useCachedAsync";
import { UserRound } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <>
        <header className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center">
          <nav className="flex gap-6 md:gap-12 items-center">
            <Skeleton className="w-[50px] h-[20px]" />
            <Skeleton className="w-[50px] h-[20px]" />
            <Skeleton className="w-[50px] h-[20px]" />
          </nav>
        </header>
        <Outlet />
      </>
    );

  return (
    <>
      <header className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center">
        {/* Left navigation links */}
        <div className="flex items-center gap-6">
          {user && <DropdownNavMenu />}

          <nav className="flex gap-6 md:gap-12 items-center max-sm:hidden">
            {((user?.role && USER_NAV_LINKS[user.role]) || GUEST_NAV_LINKS).map(
              (link) => (
                <Link
                  key={link.text}
                  to={link.link}
                  className="md:text-lg font-medium hover:underline"
                >
                  {link.text}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Right profile link */}
        {user && <ProfilePic userId={user.sub} />}
      </header>
      <Outlet />
    </>
  );
}

function DropdownNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { clearAllCache } = useCachedAsync("", async () => null, [], [], {
    enabled: false,
  });

  const onLoggout = () => {
    logout();
    clearAllCache();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="cursor-pointer"
      >
        <div className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5">
          <BurgerMenuSvg isOpen={isOpen} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {((user?.role && USER_NAV_LINKS[user.role]) || GUEST_NAV_LINKS).map(
          (link) => (
            <Link
              key={link.text}
              to={link.link}
              className="md:text-lg font-medium hover:underline sm:hidden"
            >
              <DropdownMenuItem>{link.text}</DropdownMenuItem>
            </Link>
          )
        )}
        {user && (
          <DropdownMenuItem
            onClick={onLoggout}
            className="cursor-pointer text-red-500"
          >
            Logout
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfilePic({ userId }: { userId: string }) {
  return (
    <Link to={`/users/${userId}`}>
      <div className="border-2 hover:opacity-60 rounded-full aspect-square  border-foreground">
        <UserRound className="w-8 h-8" />
      </div>
    </Link>
  );
}
