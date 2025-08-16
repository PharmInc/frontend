"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Stethoscope, GraduationCap, Building } from "lucide-react";
import { AuthFormHeader } from "./_components";

function AuthContent() {
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") ?? "signin";
  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        icon={Stethoscope}
        title="Join the Medical Network"
        subtitle="Connect with colleagues, share research, and advance your career"
      />

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
                  <h3 className="font-semibold text-lg">For Doctors & Healthcare Professionals</h3>
                  <p className="text-gray-600 text-sm">
                    Medical practitioners, specialists, nurses, and healthcare workers
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

          <Link href={`/auth/student?type=${type}`}>
            <div className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-[#3B82F6] hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    For Students
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Medical students, nursing students, and healthcare learners
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

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
