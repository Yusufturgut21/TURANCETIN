import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasMongoUri: !!process.env.MONGODB_URI,
        cloudinary: {
            hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
            hasApiKey: !!process.env.CLOUDINARY_API_KEY,
            hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
        },
        cKeys: Object.keys(process.env).filter(k => k.toLowerCase().includes("cloud"))
    });
}
