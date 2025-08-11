"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileAboutTab } from "@/components/profile/internals/ProfileAboutTab";
import { ProfileExperienceTab } from "@/components/profile/internals/ProfileExperienceTab";
import { ProfileEducationTab } from "@/components/profile/internals/ProfileEducationTab";
import { ProfilePostsTab } from "@/components/profile/internals/ProfilePostsTab";
import { ProfileActivityTab } from "@/components/profile/internals/ProfileActivityTab";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Institution } from "@/lib/api";

interface InstitutionProfileClientProps {
  institutionData: Institution;
  instituteId: string;
}

export function InstitutionProfileClient({ institutionData, instituteId }: InstitutionProfileClientProps) {
  const [activeTab, setActiveTab] = useState("Posts");

  // Convert institution data to user format for compatibility with existing components
  const institutionAsUser = {
    id: institutionData?.id || "",
    name: institutionData?.name || "",
    role: institutionData?.type || "",
    profile_picture: institutionData?.profile_picture,
    banner_picture: institutionData?.banner_picture,
    bio: institutionData?.bio,
    about: institutionData?.about,
    followers: institutionData?.followers,
    connections: 0,
    created_at: institutionData?.created_at || "",
    updated_at: institutionData?.updated_at || "",
    email: "",
    location: institutionData?.location,
    verified: institutionData?.verified,
  };

  if (!institutionData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading institution...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Institution Header */}
      <Card className="rounded-xl shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
        <ProfileHeader 
          user={institutionAsUser}
          institution={institutionData}
          currentUserId={instituteId}
        />
      </Card>

      {/* Institution Tabs */}
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "About" && (
          <ProfileAboutTab userId={instituteId} />
        )}
        {activeTab === "Experience" && (
          <ProfileExperienceTab userId={instituteId} />
        )}
        {activeTab === "Education" && (
          <ProfileEducationTab userId={instituteId} />
        )}
        {activeTab === "Posts" && <ProfilePostsTab userId={instituteId} />}
        {activeTab === "Activity" && <ProfileActivityTab/>}
      </div>
    </div>
  );
} 