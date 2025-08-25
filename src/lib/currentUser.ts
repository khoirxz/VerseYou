import { auth } from "@/lib/auth";
import { usersCollection } from "@/lib/db";

export type CurrentUser = {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const users = await usersCollection();
  const now = new Date();
  const doc = await users.findOneAndUpdate(
    { email },
    {
      // TARUH field yang selalu di-update di $set
      $set: {
        name: session?.user?.name ?? null,
        image: session?.user?.image ?? null,
        lastSeenAt: now,
      },
      // TARUH field hanya saat insert pertama kali di $setOnInsert
      $setOnInsert: {
        email,
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  return { ...doc, _id: doc?._id.toString() } as CurrentUser;
}
