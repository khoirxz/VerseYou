import mongoose from "mongoose";

const MONGODB_USER = process.env.MONGODB_USER as string;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD as string;

if (!MONGODB_USER || !MONGODB_PASSWORD) {
  throw new Error(
    "Please define the MONGODB_USER and MONGODB_PASSWORD environment variable inside .env.local"
  );
}

// ignore eslint no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(
      `mongodb+srv://nextauth:${MONGODB_PASSWORD}@${MONGODB_USER}.xvz7h6q.mongodb.net/?retryWrites=true&w=majority&appName=NextAuth`,
      {
        bufferCommands: false, // Enable buffering of commands
      }
    );

    cached.conn = await cached.promise;
    return cached.conn;
  }
}
