import { getMongoClient } from "@/lib/mongodb";

export async function usersCollection() {
  const client = await getMongoClient();
  return client.db().collection("users");
}

export async function postsCollection() {
  const client = await getMongoClient();
  return client.db().collection("posts");
}

export async function likesCollection() {
  const client = await getMongoClient();
  return client.db().collection("likes");
}

export async function commentsCollection() {
  const client = await getMongoClient();
  return client.db().collection("comments");
}
