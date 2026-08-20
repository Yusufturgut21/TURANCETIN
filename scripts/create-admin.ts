import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import { User } from "../models/User";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];
  const name = process.argv[4] || "Site Yöneticisi";

  if (!email || !password) {
    console.error(
      "Kullanım: npm run create-admin -- email@ornek.com Sifre123"
    );
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI tanımlı değil.");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Bu e-posta ile kullanıcı zaten var. Şifre güncelleniyor...");
    existing.password = await bcrypt.hash(password, 12);
    existing.isActive = true;
    await existing.save();
    console.log("Şifre güncellendi:", email);
  } else {
    await User.create({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: "admin",
    });
    console.log("Admin oluşturuldu:", email);
  }

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
