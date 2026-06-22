import { prisma } from "@/lib/prisma";

export async function getPropertyData(id: string) {
    if (!id?.trim()) {
        console.warn("Property ID inválido:", id);
        return null;
    }

    try {
        const property = await prisma.property.findUnique({
            where: { id },
        });

        return property;
    } catch (error) {
        console.error("Error al obtener la propiedad:", error);
        return null;
    }
}