// lib/spotify.ts
let tokenCache: { access_token: string; expires: number } | null = null;

export async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  // Cek token cache
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.access_token;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  tokenCache = {
    access_token: data.access_token,
    expires: Date.now() + data.expires_in * 1000 - 5000,
  };

  return tokenCache.access_token;
}
