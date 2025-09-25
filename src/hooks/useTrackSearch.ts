"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { TrackProps } from "@/types/track";

async function fetchSearch(q: string, offset = 0, signal?: AbortSignal) {
  const url = new URL("/api/spotify/search", window.location.origin);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "15");
  url.searchParams.set("offset", String(offset));
  const res = await fetch(url, { signal, cache: "no-cache" });
  if (!res.ok) throw new Error("Failed to fetch tracks");
  return res.json() as Promise<{
    items: TrackProps[];
    nextOffset: number | null;
  }>;
}

export function useTrackSearch(query: string) {
  const q = useDebounce(query.trim());
  return useInfiniteQuery({
    queryKey: ["seatchTrack", q],
    queryFn: ({ pageParam = 0, signal }) =>
      fetchSearch(q, pageParam as number, signal),
    enabled: q.length >= 2,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
}
