"use client";

import { FcGoogle } from "react-icons/fc";
import { signOut, signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Session } from "@/types/session";

const Navbar = ({ session }: { session: Session }) => {
  return (
    <nav className="fixed top-0 z-10 flex flex-col p-5 bg-background backdrop-blur-md border-b border-border w-full shadow-sm min-h-30">
      <h1 className="text-2xl font-bold">VerseYou🎵</h1>

      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-muted-foreground">
          {session && session.user?.email
            ? `Halo ${session.user?.name}, tulis pesan mu`
            : "Kirim pesan mu dengan VerseYou 🎵"}
        </div>
        <div>
          {session && session.user ? (
            <Button
              onClick={() => signOut()}
              className="bg-transparent border-0 shadow-none hover:bg-transparent text-blue-500 hover:text-blue-700">
              Sign out
            </Button>
          ) : (
            <Button
              onClick={() => signIn("google")}
              className="bg-transparent border-0 shadow-none hover:bg-transparent text-blue-500 hover:text-blue-700 flex items-center">
              <FcGoogle />
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
