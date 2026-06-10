import { revalidatePath } from "next/cache";

/**
 * Secret-gated revalidation for the tour pages. The sync runs OUTSIDE Next (a
 * standalone cron), so it can't call revalidatePath itself — after a run it pings
 * this route so the DB-backed /outboundtrip pages refresh immediately instead of
 * waiting out their ISR window.
 *
 *   GET /next/revalidate-tours?secret=...        → refresh hub + search (all locales)
 *   GET /next/revalidate-tours?secret=...&id=123 → also refresh that tour's page
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || secret !== expected) {
    return new Response("Invalid revalidate secret.", { status: 401 });
  }

  const id = searchParams.get("id");
  const paths: string[] = [];
  for (const l of ["th", "en", "zh"] as const) {
    for (const p of [`/${l}/outboundtrip`, `/${l}/outboundtrip/search`]) {
      revalidatePath(p);
      paths.push(p);
    }
    if (id) {
      const p = `/${l}/outboundtrip/tour/${id}`;
      revalidatePath(p);
      paths.push(p);
    }
  }

  return Response.json({ revalidated: true, paths });
}
