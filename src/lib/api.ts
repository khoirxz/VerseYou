import { z } from "zod";
import { createPostSchema } from "./validation";

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type Post = {
  _id: string;
  userId: string;
  spotifyTrack: CreatePostInput["spotifyTrackSchema"];
  message: string;
  moodTags: string[];
  createdAt: string;
};

export async function postPost(input: CreatePostInput): Promise<Post> {
  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) throw new Error("Input tidak valid");

  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // penting: jangan cache
    cache: "no-store",
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Gagal membuat post");
  }
  return res.json();
}
