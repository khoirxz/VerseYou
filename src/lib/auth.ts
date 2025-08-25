import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const {
  auth, // server helper: const session = await auth()
  signIn, // server action helper (opsional)
  signOut, // server action helper (opsional)
  handlers: { GET, POST }, // API route handlers
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  // custom sign-in page (opsional; pastikan /app/auth/page.tsx ada)
  pages: { signIn: "/auth" },

  // Nyalakan debug saat dev untuk lihat error detail di terminal
  // debug: process.env.NODE_ENV === "development",

  callbacks: {
    // 1) Simpan field penting ke JWT saat login pertama
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.name = profile.name ?? token.name;
        token.email = profile.email ?? token.email;
        token.picture = profile.picture ?? token.picture;
        token.sub = profile.sub ?? token.sub; // id user google
      }
      return token;
    },
    // 2) Proyeksikan dari token -> session
    async session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string) ?? session.user.name ?? null;
        session.user.email =
          (token.email as string) ?? session.user.email ?? null;

        session.user.image = (token.picture as string) ?? null; // ← foto profil
        // (opsional) id:

        session.user.id = (token.sub as string) ?? null;
      }
      return session;
    },
  },

  // Jika kamu di balik proxy/URL berubah-ubah, ini bantu atasi CSRF/origin:
  trustHost: true,
});
