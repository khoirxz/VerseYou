"use client";

import { FcGoogle } from "react-icons/fc";
import { signOut, signIn } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Session } from "@/types/session";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = ({ session }: { session: Session }) => {
  const username = session?.user?.name?.split(" ")[0].slice(0, 10);

  return (
    <nav className="fixed top-0 z-10 flex flex-row justify-between p-5 bg-white dark:bg-zinc-800 backdrop-blur-md border-b border-border w-full shadow-sm min-h-16">
      <h1 className="text-xl font-bold">VerseYou🎵</h1>

      {session && session.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarFallback>
                {session && session.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {username
                ? username.length >= 10
                  ? `${username}...`
                  : username
                : "User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => signIn("google")}
          className="bg-transparent border-0 shadow-none hover:bg-transparent text-blue-500 hover:text-blue-700 flex items-center">
          <FcGoogle />
          Sign in with Google
        </Button>
      )}
    </nav>
  );
};

export default Navbar;
