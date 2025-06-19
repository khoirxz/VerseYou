import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string | null;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to the session object
      session.user = session.user ?? {}; // Ensure session.user is an object
      session.user.name = token.name || null;

      return session;
    },
  },
};
