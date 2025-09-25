import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import PostForm from "@/components/PostForm";
import Feed from "@/components/Feed";

export default async function DashboardPage() {
  // prefetch 1 halaman
  const qc = new QueryClient();
  await qc.prefetchInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/posts?limit=15`,
        { cache: "no-store" }
      );
      return res.json();
    },
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <div className="w-full max-w-md p-6 mx-auto space-y-12">
        <PostForm />

        <Feed />
      </div>
    </HydrationBoundary>
  );
}
