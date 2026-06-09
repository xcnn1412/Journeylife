import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Draft-mode entry point used by Payload's "Preview" button and Live Preview iframe.
 * Validates the (optional) preview secret, turns on Next draft mode, then redirects
 * to the requested page so it renders the latest *draft* content.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const secret = searchParams.get("secret");

  // The secret is the gate that stops anyone enabling draft mode to read
  // unpublished posts. REQUIRED in production (set PREVIEW_SECRET in the env);
  // also enforced whenever a secret is configured. Dev with no secret is allowed.
  const expectedSecret = process.env.PREVIEW_SECRET;
  if ((expectedSecret || process.env.NODE_ENV === "production") && secret !== expectedSecret) {
    return new Response("Invalid preview secret.", { status: 401 });
  }

  // Only allow previewing portfolio pages — guards against open redirects.
  // Accept both bare and locale-prefixed paths (/portfolio, /th/portfolio, …).
  if (!path || !/^\/(?:(?:th|en|zh)\/)?portfolio(?:\/|$)/.test(path)) {
    return new Response("Invalid preview path.", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
