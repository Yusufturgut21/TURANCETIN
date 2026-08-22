import { v2 as cloudinary } from "cloudinary";

function env(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

const cloudName = env("CLOUDINARY_CLOUD_NAME");
const apiKey = env("CLOUDINARY_API_KEY");
const apiSecret = env("CLOUDINARY_API_SECRET");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

export async function uploadImage(
  file: string,
  folder = "turancetin"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}
