"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileAboutTab } from "@/components/profile/internals/ProfileAboutTab";
import { ProfileExperienceTab } from "@/components/profile/internals/ProfileExperienceTab";
import { ProfileEducationTab } from "@/components/profile/internals/ProfileEducationTab";
import { ProfilePostsTab } from "@/components/profile/internals/ProfilePostsTab";
import { ProfileActivityTab } from "@/components/profile/internals/ProfileActivityTab";
import { useState } from "react";
import { User } from "@/lib/api";

interface ProfilePageClientProps {
  profileData: User;
  currentUserId: string | null;
  userId: string;
}

export function ProfilePageClient({ profileData, currentUserId, userId }: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState("Posts");
  const [userData, setUserData] = useState(profileData);

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
  };

  if (!userData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProfileHeader
        user={userData}
        institution={null}
        currentUserId={currentUserId || ""}
        onUserUpdate={handleUserUpdate}
      />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-4">
        {activeTab === "About" && (
          <ProfileAboutTab userId={userId} />
        )}
        {activeTab === "Experience" && (
          <ProfileExperienceTab userId={userId} />
        )}
        {activeTab === "Education" && (
          <ProfileEducationTab userId={userId} />
        )}
        {activeTab === "Posts" && <ProfilePostsTab userId={userId} />}
        {activeTab === "Activity" && <ProfileActivityTab />}
      </div>
    </div>
  );
} 