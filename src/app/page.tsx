import { auth } from "@/lib/auth";

import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import PostForm from "@/components/PostForm";

export default async function DashboardPage() {
  const session = await auth(); // null kalau belum login
  const user = session?.user;

  return (
    <div className="flex flex-col h-screen w-full font-[family-name:var(--font-plus-jakarta-sans)] relative bg-white pt-30">
      <Navbar session={{ user: user }} />

      <div className="w-full max-w-md p-6 mx-auto space-y-12">
        <PostForm />

        <PostCard />
      </div>
    </div>
  );
}
