import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { BackButton } from "@/components/auth/BackButton";

interface AuthFormHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export function AuthFormHeader({ icon: Icon, title, subtitle, showBackButton = true }: AuthFormHeaderProps) {
  return (
    <div className="mb-8 text-center w-full">
      <div className="flex w-full justify-between">
        {showBackButton && <BackButton />}
        
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img
            src="/logo.png"
            alt="PharmInc Logo"
            className="h-12 w-auto rounded-md"
            />
        </Link>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon className="h-8 w-8 text-[#3B82F6]" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
