import { getSpotifyAccessToken } from "@/lib/spotify";
import { Root } from "@/types/result";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const token = await getSpotifyAccessToken();
  const { id } = await params;

  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}?market=ID`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    return new Response(JSON.stringify({ error: errorData.error }), {
      status: res.status,
    });
  }

  const data: Root["tracks"]["items"][0] = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : res.status,
  });
}
