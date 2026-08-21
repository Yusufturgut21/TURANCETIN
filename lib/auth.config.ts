import type { NextAuthConfig } from "next-auth";

const authSecret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || undefined;

export const authConfig: NextAuthConfig = {
    providers: [],
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
