// lib/spotify.ts
import type { SearchProps } from "@/types/search";
import type { TrackProps } from "@/types/track";

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

let _token: { value: string; exp: number } | null = null;

async function getAppToken() {
  const now = Math.floor(Date.now() / 1000);

  if (_token && _token.exp > now + 30) return _token.value;

  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) throw new Error("Failed to get Spotify token");
  const json = await res.json();
  _token = {
    value: json.access_token,
    exp: Math.floor(Date.now() / 1000) + json.expires_in,
  };

  return _token.value;
}

export async function searchTracks(
  q: string,
  opt?: {
    limit?: number;
    offset?: number;
  }
) {
  const token = await getAppToken();
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "track");
  url.searchParams.set("market", "ID");
  url.searchParams.set("limit", String(opt?.limit ?? 10));
  url.searchParams.set("offset", String(opt?.offset ?? 0));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to search tracks");
  const data: SearchProps = await res.json();

  const tracks = data.tracks.items.map((t) => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map((a) => a.name),
    album: t.album.name,
    image: t.album.images[0].url ?? "",
    previewUrl: t.preview_url ?? undefined,
    externalUrl: t.external_urls.spotify,
  })) as TrackProps[];
  return tracks;
}
