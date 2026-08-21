import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import type { NextAuthConfig } from "next-auth";

const authSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;

if (!authSecret && process.env.NODE_ENV === "production") {
  console.error(
    "[auth] AUTH_SECRET / NEXTAUTH_SECRET eksik. Vercel Environment Variables'a ekleyin."
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;

          if (!email || !password) {
            return null;
          }

          await connectDB();
          const user = await User.findOne({
            email: email.toLowerCase().trim(),
          }).lean();

          if (!user || !user.isActive) {
            return null;
          }

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return null;
          }

          return {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] authorize failed:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/admin/giris",
    error: "/admin/giris",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
  secret: authSecret,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
