import { connectDB } from "@/lib/mongodb";
import { Greeting } from "@/models/greeting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { name, message, music } = await request.json();
    if (!name || !message || !music) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    await connectDB();

    const saved = await Greeting.create({
      userEmail: session.user.email,
      name,
      sender: session.user.name || "Anonymous",
      message,
      music,
    });

    revalidatePath("/greeting");

    return Response.json(saved, {
      status: 201,
    });
  } catch (error) {
    console.error("Error saving greeting:", error);
    return new Response(JSON.stringify({ error: "Failed to save greeting" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const greetings = await Greeting.find().sort({ createdAt: -1 }).limit(10);
    return Response.json(greetings, { status: 200 });
  } catch (error) {
    console.error("Error fetching greetings:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch greetings" }),
      {
        status: 500,
      }
    );
  }
}
