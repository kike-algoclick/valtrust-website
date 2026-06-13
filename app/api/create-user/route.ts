import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const role = user.unsafeMetadata.role;

  if (role === "buyer") {
    await prisma.buyerProfile.create({
      data: {
        clerkId: userId,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      },
    });
  }

  if (role === "seller") {
    await prisma.sellerProfile.create({
      data: {
        clerkId: userId,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.primaryEmailAddress?.emailAddress ?? "",
        phone: "",
      },
    });
  }

  return Response.json({ success: true });
}