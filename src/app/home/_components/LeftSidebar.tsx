import Link from "next/link";
import {
  Home,
  Search,
  MessageCircle,
  FileText,
  Bell,
  Network,
} from "lucide-react";
import { BiLogOut } from "react-icons/bi";
import { User } from "./types";
import Logo from "@/components/logo";

interface LeftSidebarProps {
  user?: User| null;
}

export default function LeftSidebar({ user = null }: LeftSidebarProps) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 md:w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col p-2 md:p-3 z-40">
      <Logo />

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto py-2 md:py-3">
        <Link href="/" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <Search className="h-4 w-4" />
          <span>Explore</span>
        </Link>
        <Link href="/messages" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <MessageCircle className="h-4 w-4" />
          <span>Messages</span>
        </Link>
        <Link href="/jobs" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <FileText className="h-4 w-4" />
          <span>Jobs</span>
        </Link>
        <Link href="/notifications" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
        </Link>
        <Link href="/societies" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-50 text-base md:text-lg text-gray-700">
          <Network className="h-4 w-4" />
          <span>Societies</span>
        </Link>
      </nav>

      {
        user ? (
          <div className="border-t border-gray-200 pt-2 md:pt-3 flex-shrink-0">
            <Link href="/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 mb-2">
              <img
                src={user?.profilePicture || "/pp.png"}
                alt="Profile"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-200 object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                  {user?.name || "User"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {user?.speciality || "Doctor"}
                </p>
              </div>
            </Link>
            
            <Link
              href="/logout"
              className="flex items-center gap-2 px-2 py-2 rounded hover:bg-red-50 text-xs md:text-sm text-red-600 w-full"
            >
              <BiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-2 md:pt-3 flex-shrink-0 space-y-2">
            <Link href="/auth" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm text-center py-2 px-4 rounded-md text-sm">
                Login
            </Link>
            <Link href="/auth" className="block w-full bg-gradient-to-r border-2 hover:bg-gray-100 border-blue-500 text-blue-500 shadow-sm text-center py-2 px-4 rounded-md text-sm">
                Signup
            </Link>
          </div>
        )
      }
    </aside>
  );
}
