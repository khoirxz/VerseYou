import {
  createPostSchema,
  type PostProps,
  type CreatePostProps,
} from "./validation";

export async function postPost(input: CreatePostProps): Promise<PostProps> {
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
