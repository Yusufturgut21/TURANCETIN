import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
});

