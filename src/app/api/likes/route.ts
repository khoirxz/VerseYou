import "server-only";
import { getCurrentUser } from "@/lib/currentUser";
import { likesCollection } from "@/lib/db";
import { likeToggleSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = likeToggleSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const { postId } = parsed.data;
  const likes = await likesCollection();

  // cek apakah sudah dilike
  const existingLike = await likes.findOne({ postId, userId: me._id });
  if (existingLike) {
    await likes.deleteOne({ postId, userId: me._id });
    return Response.json({ liked: false });
  } else {
    await likes.insertOne({ postId, userId: me._id, createdAt: new Date() });
    return Response.json({ liked: true });
  }
}
