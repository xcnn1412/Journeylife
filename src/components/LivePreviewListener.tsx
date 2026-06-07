"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/**
 * Mounted only inside the Live Preview iframe (draft mode). It listens for
 * Payload's "document saved" message and re-fetches the server-rendered page
 * via router.refresh(), so the preview updates whenever the editor saves.
 */
export function LivePreviewListener() {
  const router = useRouter();
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}
    />
  );
}
