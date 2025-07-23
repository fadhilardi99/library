"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SyncUser() {
  const { user, isSignedIn } = useUser();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (isSignedIn && !synced) {
      fetch("/api/sync-user")
        .then(() => setSynced(true))
        .catch(() => {});
    }
  }, [isSignedIn, synced]);

  return null;
}
