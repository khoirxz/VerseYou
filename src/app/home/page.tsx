import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import HomeSection from "@/app/home/partials/HomeSections";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col h-screen w-full font-[family-name:var(--font-geist-sans)] relative">
      <Navbar session={{ user: session?.user || null }} />

      <div className="w-full max-w-md p-6 mt-26 mx-auto">
        <HomeSection session={{ user: session?.user || null }} />
      </div>
    </div>
  );
}
