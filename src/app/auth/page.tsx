"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Stethoscope, Users, Building } from "lucide-react";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "signin";
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <img
            src="/logo.png"
            alt="PharmInc Logo"
            className="h-12 w-auto rounded-md"
          />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Join the Medical Network
        </h1>
        <p className="text-gray-600">
          Connect with colleagues, share research, and advance your career
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-center mb-6">
          Choose Your Profile Type
        </h2>

        <div className="flex flex-col gap-4">
          <Link href={`/auth/doctor?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">For Doctors</h3>
                  <p className="text-gray-600 text-sm">
                    Medical practitioners, specialists, and physicians
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {type !== "signup" && (
            <Link href={`/auth/institute?type=${type}`}>
              <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      For Institutions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Hospitals, clinics, research centers, and more
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <Link href={`/auth/healthcare?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    For Healthcare Professionals
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nurses, pharmacists, researchers, and other healthcare
                    workers
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
