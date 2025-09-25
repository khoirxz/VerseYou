"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFeedInfinite } from "@/hooks/useFeedInfinite";
import PostCard from "./PostCard";

export default function Feed() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedInfinite();

  const items = useMemo(
    () => (data ? data.pages.flatMap((p) => p.items) : []),
    [data]
  );

  // auto-load
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const node = sentinelRef.current;
    if (!node) return;

    const ob = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) fetchNextPage();
    });

    ob.observe(node);
    return () => ob.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) return <Skeleton />;

  if (isError) return <div>Gagal memuat feed</div>;

  return (
    <div>
      <div className="grid grid-cols-1 gap-14">
        {items.map((p) => (
          <PostCard key={p._id} item={p} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex items-center justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-300">
            {isFetchingNextPage ? "Memuat..." : "Memuat lebih banyak"}
          </button>
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className="h-10" />}
    </div>
  );
}

function Skeleton() {
  return <div>Skeleton</div>;
}
