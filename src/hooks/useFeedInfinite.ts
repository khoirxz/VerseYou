"use client";

import { FeedProps } from "@/types/feeds";
import { useInfiniteQuery } from "@tanstack/react-query";

async function fetchFeed(
  cursor?: string,
  signal?: AbortSignal
): Promise<FeedProps> {
  const url = new URL("/api/posts", window.location.origin);
  url.searchParams.set("limit", "15");

  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetch(url.toString(), { cache: "no-cache", signal });
  if (!res.ok) throw new Error("Failed to fetch posts");

  return res.json();
}

export function useFeedInfinite() {
  return useInfiniteQuery<FeedProps>({
    queryKey: ["feedInfinite"],
    queryFn: ({ pageParam, signal }) =>
      fetchFeed(pageParam as string | undefined, signal),
    initialPageParam: undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    staleTime: 0,
    gcTime: 5 * 60_000,
  });
}
