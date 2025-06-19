import { getSpotifyAccessToken } from "@/lib/spotify";
import { Root } from "@/types/result";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return new Response(
      JSON.stringify({
        error: 'Query parameter "q" is required',
      }),
      {
        status: 400,
      }
    );
  }

  const token = await getSpotifyAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&market=ID&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data: Root = await res.json();
  return new Response(JSON.stringify(data.tracks.items), {
    status: res.ok ? 200 : res.status,
  });
}
