import "../src/envConfig.ts";
import { getMongoClient } from "@/lib/mongodb";

async function main() {
  const client = await getMongoClient();
  const db = client.db();

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("posts").createIndex({ createdAt: -1 });
  await db
    .collection("likes")
    .createIndex({ postId: 1, userId: 1 }, { unique: true });
  await db.collection("comments").createIndex({ postId: 1, createdAt: -1 });

  console.log("Indexes created successfully.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
