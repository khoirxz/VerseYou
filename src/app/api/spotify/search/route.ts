import { searchTracks } from "@/lib/spotify";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Number(searchParams.get("limit") ?? 10);
  const offset = Number(searchParams.get("offset") ?? 0);
  if (!q) return Response.json({ items: [], nextOffset: null });

  // panggil util spotify
  const items = await searchTracks(q, { limit, offset });

  // infinite scroll
  const nextOffset = items.length === limit ? offset + limit : null;

  // cache off, search tidak perlu ini
  return Response.json(
    { items, nextOffset },
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
}
