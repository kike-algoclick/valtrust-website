import { prisma } from "@/lib/prisma";
import ListingCarousel from "./listingcardcarousel";

export default async function ListingCarouselServer() {
    const properties = await prisma.property.findMany({
        where: { status: "available" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            price: true,
            verificationStatus: true,
        },
    });

    const formatted = properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        verificationStatus: p.verificationStatus as "unverified" | "deed_verified" | "fully_verified",
    }));

    return <ListingCarousel properties={formatted} />;
}