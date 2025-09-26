import { Link, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GUEST_NAV_LINKS, USER_NAV_LINKS } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import BurgerMenuSvg from "@/components/ui/BurgerMenuSvg";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
        <ProfilePic />
      </header>
      <Outlet />
    </>
  );
}

function DropdownNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

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
            onClick={logout}
            className="cursor-pointer text-red-500"
          >
            Logout
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfilePic() {
  return (
    <Link to="/profile">
      <Avatar className="w-9 h-9">
        <AvatarImage src="/profile-pic-placeholder.png" alt="User" />
        <AvatarFallback>
          <div className="w-9 h-9 bg-gray-400 flex items-end justify-center">
            <svg
              className="w-6 h-8"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>profile [#1335]</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-420.000000, -2159.000000)"
                  fill="#000000"
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M374,2009 C371.794,2009 370,2007.206 370,2005 C370,2002.794 371.794,2001 374,2001 C376.206,2001 378,2002.794 378,2005 C378,2007.206 376.206,2009 374,2009 M377.758,2009.673 C379.124,2008.574 380,2006.89 380,2005 C380,2001.686 377.314,1999 374,1999 C370.686,1999 368,2001.686 368,2005 C368,2006.89 368.876,2008.574 370.242,2009.673 C366.583,2011.048 364,2014.445 364,2019 L366,2019 C366,2014 369.589,2011 374,2011 C378.411,2011 382,2014 382,2019 L384,2019 C384,2014.445 381.417,2011.048 377.758,2009.673"
                      id="profile-[#1335]"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
