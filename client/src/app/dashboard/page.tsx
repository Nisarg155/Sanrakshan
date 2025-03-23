"use client";

import UserContracts from "@/components/dashboard/user-contracts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div>
      <UserContracts />
    </div>
  );
}