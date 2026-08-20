import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { DEFAULT_SETTINGS, type SiteSettingsDTO } from "@/lib/defaults";

export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  await connectDB();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    const created = await SiteSettings.create({});
    settings = created.toObject();
  }
  return JSON.parse(JSON.stringify(settings)) as SiteSettingsDTO;
}

export async function getSiteSettingsSafe(): Promise<SiteSettingsDTO> {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error("[settings]", error instanceof Error ? error.message : error);
    return { ...DEFAULT_SETTINGS };
  }
}
