import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function getValuationData(publicId: string) {
    if (!publicId?.trim()) {
        console.warn("Public ID inválido:", publicId);
        return null;
    }

    try {
        const valuation = await prisma.valuation.findUnique({
            where: {
                publicId,
            },
        });

        return valuation;
    } catch (error) {
        console.error("Error al obtener la valoración:", error);
        return null;
    }
}