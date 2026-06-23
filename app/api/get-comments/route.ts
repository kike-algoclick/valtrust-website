import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Role } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function GET(req: Request){
    const {userId} = await auth();
    const user = await currentUser();
    if (!userId || !user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

   const role = user.unsafeMetadata.role as Role;

  const comments = await prisma.siteComment.findMany({
    where: {
      role: role,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
   const safeComments = comments.map((c) => ({
    ...c,
    id: c.id ? c.id.toString() : null,
    clerkId: c.clerkId ? c.clerkId.toString() : null,
  }));

  return Response.json({ comments: safeComments });

}



