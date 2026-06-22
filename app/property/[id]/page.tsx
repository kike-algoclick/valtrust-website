import { getPropertyData } from "./getData";
import PropertyDetailClient from "./PropertyDetailClient";

export default async function PropertyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const property = await getPropertyData(id);

    if (!property)
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No se encontró la propiedad.
            </div>
        );

    return <PropertyDetailClient property={property} />;
}
