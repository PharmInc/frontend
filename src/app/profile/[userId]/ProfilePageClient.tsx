"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileAboutTab } from "@/components/profile/internals/ProfileAboutTab";
import { ProfileExperienceTab } from "@/components/profile/internals/ProfileExperienceTab";
import { ProfileEducationTab } from "@/components/profile/internals/ProfileEducationTab";
import { ProfilePostsTab } from "@/components/profile/internals/ProfilePostsTab";
import { ProfileActivityTab } from "@/components/profile/internals/ProfileActivityTab";
import { ProfileConnectionsCard } from "@/components/profile/cards/ProfileConnectionsCard";
import { ProfileTrendingTagsCard } from "@/components/profile/cards/ProfileTrendingTagsCard";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { User } from "@/lib/api";

interface ProfilePageClientProps {
  profileData: User;
  currentUserId: string | null;
  userId: string;
}

export function ProfilePageClient({ profileData, currentUserId, userId }: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="col-span-2">
            <ProfileSidebar user={profileData} />
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            <Card className="mb-8 rounded-xl shadow-lg border-0 overflow-hidden bg-white/90 backdrop-blur-xs hover:shadow-xl transition-shadow duration-300">
              <ProfileHeader
                user={profileData}
                institution={null}
                currentUserId={currentUserId || ""}
              />
            </Card>

            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "About" && (
              <ProfileAboutTab userId={userId} />
            )}
            {activeTab === "Experience" && (
              <ProfileExperienceTab userId={userId} />
            )}
            {activeTab === "Education" && (
              <ProfileEducationTab userId={userId} />
            )}
            {activeTab === "Posts" && <ProfilePostsTab />}
            {activeTab === "Activity" && <ProfileActivityTab />}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-6">
            <ProfileConnectionsCard />
            <ProfileTrendingTagsCard />
          </div>
        </div>
      </div>
    </div>
  );
} 