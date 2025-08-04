"use client";

import React from "react";
import { ProfileConnectionsCard } from "@/components/profile/cards/ProfileConnectionsCard";
import { ProfileResourcesCard } from "@/components/profile/cards/ProfileResourcesCard";

export function InstituteRightSidebar() {
  return (
    <div className="p-4 space-y-6">
      <ProfileResourcesCard />
      <ProfileConnectionsCard />
    </div>
  );
}
