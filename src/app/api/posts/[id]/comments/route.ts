import "server-only";
import { getCurrentUser } from "@/lib/currentUser";
import { commentsCollection } from "@/lib/db";
import { commentsCursorSchema, createCommentSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id;
  const url = new URL(req.url);
  const parsed = commentsCursorSchema.safeParse({
    cursor: url.searchParams.get("cursor") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success)
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });

  const { cursor, limit = 20 } = parsed.data;
  const comments = await commentsCollection();

  const filter = {
    postId,
    ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
  };
  const page = await comments
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  const items = page.map((c) => ({ ...c, _id: c._id.toString() }));
  const nextCursor = page.length
    ? page[page.length - 1].createdAt.toISOString()
    : null;

  return Response.json({ items, nextCursor });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const me = await getCurrentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: parsed.error }, { status: 400 });

  const comments = await commentsCollection();
  const doc = {
    postId: params.id,
    userId: me._id,
    body: parsed.data.body,
    createdAt: new Date(),
  };
  const { insertedId } = await comments.insertOne(doc);

  return Response.json({ _id: insertedId.toString(), ...doc });
}
