"use client";

import React from "react";
import { ProfileConnectionsCard } from "@/components/profile/cards/ProfileConnectionsCard";
import { ProfileTrendingTagsCard } from "@/components/profile/cards/ProfileTrendingTagsCard";
import { ProfileActivityCard } from "@/components/profile/cards/ProfileActivityCard";

export function ProfileRightSidebar() {
  return (
    <div className="p-4 space-y-6">
      <ProfileConnectionsCard />
      <ProfileTrendingTagsCard />
      <ProfileActivityCard />
    </div>
  );
}
