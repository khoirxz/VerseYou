"use client";

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postPost } from "@/lib/api";
import { type CreatePostProps, type PostProps } from "@/lib/validation";

type FeedPage = {
  items: PostProps[];
  nextCursor: string | null;
};

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostProps) => postPost(input),

    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: ["feedInfinite"] });

      const optimistic: PostProps = {
        _id: "optimistic-" + Date.now(),
        userId: "me",
        spotifyTrackSchema: newPost.spotifyTrackSchema,
        message: newPost.message,
        moodTags: newPost.moodTags ?? [],
        createdAt: new Date().toISOString(),
      };

      const prevInfinite = qc.getQueryData<InfiniteData<FeedPage>>([
        "feedInfinite",
      ]);
      const nextInfinite: InfiniteData<FeedPage> = prevInfinite
        ? {
            ...prevInfinite,
            pages: [
              {
                ...prevInfinite.pages[0],
                items: [optimistic, ...(prevInfinite.pages[0]?.items ?? [])],
              },
              ...prevInfinite.pages.slice(1),
            ],
          }
        : {
            pageParams: [undefined],
            pages: [{ items: [optimistic], nextCursor: null }],
          };

      qc.setQueryData<InfiniteData<FeedPage>>(["feedInfinite"], nextInfinite);

      qc.setQueryData(
        ["feed"],
        (old: { items: PostProps[]; nextCursor: string | null } | undefined) =>
          old
            ? { ...old, items: [optimistic, ...(old.items ?? [])] }
            : { items: [optimistic], nextCursor: null }
      );

      return { prevInfinite };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevInfinite) qc.setQueryData(["feed"], ctx.prevInfinite);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
