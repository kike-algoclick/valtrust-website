import { prisma } from "@/lib/prisma";
import PropertyCard from "./PropertyCard";

export default async function PropertyListServer() {
    const properties = await prisma.property.findMany({
        where: { status: "available" },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            price: true,
            location: true,
            verificationStatus: true,
        },
    });

    if (!properties.length) {
        return (
            <div className="text-sm text-gray-400 py-6">
                No listings available yet.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {properties.map((property) => (
                <PropertyCard
                    key={property.id}
                    property={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        location: property.location,
                        verificationStatus: property.verificationStatus as
                            | "unverified"
                            | "deed_verified"
                            | "fully_verified",
                    }}
                />
            ))}
        </div>
    );
}
