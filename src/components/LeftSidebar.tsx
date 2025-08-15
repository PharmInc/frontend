import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  MessageCircle,
  FileText,
  Bell,
  Network,
  Bookmark,
  Crown,
  User as UserIcon,
  Users,
  LogOut,
} from "lucide-react";
import { User, InstitutionEntity } from "../app/(home)/home/_components/types";
import Logo from "@/components/logo";
import { useUserStore, useInstitutionStore } from "@/store";
import { clearAuthToken, getUserType } from "@/lib/api/utils";
import { getDisplayHandle, getProfilePicture } from "../app/(home)/home/_utils/utils";

interface LeftSidebarProps {
  user?: User | InstitutionEntity | null;
}

const navigations = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/my-networks', icon: Users, label: 'My Networks' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/jobs', icon: FileText, label: 'Jobs' },
  { href: '/societies', icon: Network, label: 'Societies' },
  { href: '/verifications', icon: Crown, label: 'Verifications' },
];

export default function LeftSidebar({ user = null }: LeftSidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { clearUser } = useUserStore();
  const { clearInstitution } = useInstitutionStore();
  const userType = getUserType()
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    clearUser();
    clearInstitution();
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col font-sans pt-3">
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
        {navigations.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href}
            href={href} 
            className={`group xl:flex xl:items-center xl:gap-4 xl:px-4 xl:py-3 xl:rounded-full xl:hover:bg-gray-100 xl:w-fit flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors`}
          >
            <Icon className={`h-6 w-6 text-gray-700 group-hover:text-gray-900 ${isActive(href) ? 'text-gray-900 font-bold stroke-2' : ''}`} />
            <span className={`xl:block hidden text-xl text-gray-900 ${isActive(href) ? 'font-semibold' : 'font-normal'}`}>
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4 pt-0 border-t border-gray-100 flex-shrink-0">
        {user ? (
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-100 transition-colors w-full text-left"
            >
              <img
                src={getProfilePicture(user)}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-200 object-cover flex-shrink-0"
              />
              <div className="xl:flex hidden flex-col flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500 truncate capitalize">
                  {getDisplayHandle(user)}
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
                <Link 
                  href={`/${userType==='institution'?"institute":"profile"}/${user.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Profile</span>
                </Link>
                <hr className="border-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Logout</span>
                </button>
              </div>
            )}
          </div>
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
