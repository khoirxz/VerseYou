"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postPost, type CreatePostInput, type Post } from "@/lib/api";

export function useCreatePost() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => postPost(input),

    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<{
        items: Post[];
        nextCursor: string | null;
      }>(["feed"]);

      const optimistic: Post = {
        _id: "optimistic-" + Date.now(),
        userId: "me",
        spotifyTrack: newPost.spotifyTrackSchema,
        message: newPost.message,
        moodTags: newPost.moodTags ?? [],
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData(
        ["feed"],
        (old: { items: Post[]; nextCursor: string | null } | undefined) =>
          old
            ? { ...old, items: [optimistic, ...old.items] }
            : { items: [optimistic], nextCursor: null }
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["feed"], ctx.prev);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
