import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import GreetingForm from "@/components/GreetingForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col h-screen w-full font-[family-name:var(--font-geist-sans)] relative">
      <nav className="fixed top-0 z-10 flex flex-col p-5 bg-background backdrop-blur-md border-b border-border w-full">
        <h1 className="text-2xl font-bold">VerseYou🎵</h1>

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-muted-foreground">
            {session ? `Logged in as ${session.user?.email}` : "Not logged in"}
          </div>
          <div>
            {session ? (
              <Link
                href="/api/auth/signout"
                className="text-blue-500 hover:underline">
                Sign out
              </Link>
            ) : (
              <a href="/auth" className="text-blue-500 hover:underline">
                Sign in
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md p-6 mt-26 mx-auto">
        <GreetingForm />
      </div>
    </div>
  );
}
