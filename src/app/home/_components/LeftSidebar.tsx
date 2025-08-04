import Link from "next/link";
import {
  Home,
  Search,
  MessageCircle,
  FileText,
  Bell,
  Network,
  Bookmark,
  Crown,
} from "lucide-react";
import { User, InstitutionEntity } from "./types";
import Logo from "@/components/logo";
import { getDisplayHandle, getProfilePicture } from "../_utils/utils";

interface LeftSidebarProps {
  user?: User | InstitutionEntity | null;
}

export default function LeftSidebar({ user = null }: LeftSidebarProps) {
  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col font-sans">
      <div className="p-4 pb-0 flex-shrink-0">
        <div className="xl:block hidden mb-8">
          <Logo />
        </div>
        <div className="xl:hidden block mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto xl:px-3 px-2 min-h-0 mt-2 xl:mt-7">
        <Link href="/" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Home className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Home</span>
        </Link>
        
        <Link href="/explore" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Search className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Explore</span>
        </Link>
        
        <Link href="/notifications" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Notifications</span>
        </Link>
        
        <Link href="/messages" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <MessageCircle className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Messages</span>
        </Link>
        
        <Link href="/bookmarks" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Bookmark className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Bookmarks</span>
        </Link>
        
        <Link href="/jobs" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <FileText className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Jobs</span>
        </Link>
        
        <Link href="/societies" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Network className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Societies</span>
        </Link>
        
        <Link href="/premium" className="group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors">
          <Crown className="h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <span className="xl:block hidden text-xl text-gray-900 font-normal">Premium</span>
        </Link>
      </nav>

      <div className="p-4 pt-0 border-t border-gray-100 flex-shrink-0">
        {user ? (
          <Link href="/profile" className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-100 transition-colors w-full">
            <img
              src={getProfilePicture(user)}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-200 object-cover flex-shrink-0"
            />
            <div className="xl:flex hidden flex-col flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {user?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                @{getDisplayHandle(user)}
              </p>
            </div>
          </Link>
        ) : (
          <div>
            <Link href="/auth" className="xl:block hidden w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-full font-bold transition-colors">
              Sign in
            </Link>
            <Link href="/auth" className="xl:hidden flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors mx-auto">
              <span className="font-bold text-lg">L</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
