import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        hasAuthSecret: !!process.env.AUTH_SECRET,
        authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length ?? 0,
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriPrefix: process.env.MONGODB_URI?.substring(0, 20) ?? "NOT SET",
        nextAuthUrl: process.env.NEXTAUTH_URL ?? "NOT SET",
        nodeEnv: process.env.NODE_ENV,
    });
}
