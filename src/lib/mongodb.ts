import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
// test uri
if (!uri) throw new Error("Please add your Mongo URI to .env.local");

declare global {
  var _mongoClient: {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
}

const globalForMongo = global as typeof global & {
  _mongoClient: {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
};

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = { client: null, promise: null };
}

export async function getMongoClient() {
  const store = globalForMongo._mongoClient;
  if (store.client) return store.client;
  if (!store.promise) {
    const client = new MongoClient(uri || "", {});
    store.promise = client.connect().then((client) => {
      store.client = client;
      return client;
    });
  }

  return store.promise;
}

export async function getDb(dbName: string) {
  const client = await getMongoClient();
  return client.db(dbName);
}
