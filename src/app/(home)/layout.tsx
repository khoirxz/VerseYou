import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "VerseYou - Home",
  description: "VerseYou is a platform to send messages with music",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // null kalau belum login
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen w-full font-[family-name:var(--font-plus-jakarta-sans)] relative bg-gray-200 pt-18">
      <Navbar session={{ user: user }} />

      {children}
    </div>
  );
}
