import prisma from "../config/prisma.js";

export const cleanUnapprovedUsers = async () => {
  const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const deleted = await prisma.user.deleteMany({
    where: {
      approved: false,
      createdAt: { lt: expiryTime },
    },
  });
  console.log(`Deleted ${deleted.count} unapproved users`);
};