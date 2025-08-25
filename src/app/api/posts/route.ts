import { getCurrentUser } from "@/lib/currentUser";
import { postsCollection, likesCollection, commentsCollection } from "@/lib/db";
import { createPostSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        error: parsed.error,
      },
      { status: 400 }
    );

  const doc = {
    userId: me._id,
    spotifyTrack: parsed.data.spotifyTrackSchema,
    message: parsed.data.message,
    moodTags: parsed.data.moodTags ?? [],
    createdAt: new Date(),
  };

  const posts = await postsCollection();
  const { insertedId } = await posts.insertOne(doc);

  return Response.json({
    _id: insertedId.toString(),
    ...doc,
  });
}

export async function GET(req: Request) {
  const me = await getCurrentUser();
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const limit = Number(url.searchParams.get("limit") ?? 15);

  const posts = await postsCollection();
  const filter = cursor ? { createdAt: { $lt: new Date(cursor) } } : {};

  const raw = await posts
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  const items = raw.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt,
  }));
  const ids = items.map((p) => p._id);

  const [likes, comments] = await Promise.all([
    (
      await likesCollection()
    )
      .aggregate([
        { $match: { postId: { $in: ids } } },
        {
          $group: {
            _id: "$postId",
            count: { $sum: 1 },
            users: { $addToSet: "$userId" },
          },
        },
      ])
      .toArray(),
    (await commentsCollection())
      .aggregate([
        { $match: { postId: { $in: ids } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const likeMap = new Map(likes.map((l) => [l._id, l]));
  const commentMap = new Map(comments.map((c) => [c._id, c]));

  const augmented = items.map((p) => {
    const l = likeMap.get(p._id);
    const c = commentMap.get(p._id);
    const likeCount = l?.count ?? 0;
    const commentCount = c?.count ?? 0;
    const likedByMe = me ? Boolean(l?.users?.includes(me._id)) : false;
    return { ...p, likeCount, commentCount, likedByMe };
  });

  const nextCursor = items.length
    ? items[items.length - 1].createdAt.toISOString()
    : null;
  return Response.json({ items: augmented, nextCursor });
}
