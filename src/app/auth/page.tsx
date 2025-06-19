"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <div className="grid h-screen w-full grid-cols-2 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full h-full max-w-md p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">PesanMu</h1>
        <p className="mb-6">Please log in to continue.</p>
        {/* Add your authentication form or component here */}
        <Button onClick={() => signIn("google")}>Log in with Google</Button>
      </div>
      <div className="flex items-center justify-center w-full max-w-md p-6">
        {/* Sould be image */}
      </div>
    </div>
  );
};

export default LoginPage;
