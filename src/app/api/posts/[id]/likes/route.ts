import "server-only";
import { getCurrentUser } from "@/lib/currentUser";
import { likesCollection } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const me = await getCurrentUser();
  const postId = params.id;

  const likes = await likesCollection();

  const [count, likedByMe] = await Promise.all([
    likes.countDocuments({ postId }),
    me
      ? likes.findOne({ postId, userId: me._id }).then(Boolean)
      : Promise.resolve(false),
  ]);

  return Response.json({ count, likedByMe });
}
