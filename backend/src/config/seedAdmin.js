import prisma from "./prisma.js";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
  try {
    const existing = await prisma.user.findFirst({
      where: { role: "SUPREME_ADMIN" },
    });

    if (existing) {
      console.log("✅ Supreme Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await prisma.user.create({
      data: {
        name: "Supreme Admin",
        email: "pawan123@gmail.com",
        password: hashedPassword,
        role: "SUPREME_ADMIN",
        approved: true,
      },
    });

    console.log("🔥 Supreme Admin created successfully");
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};