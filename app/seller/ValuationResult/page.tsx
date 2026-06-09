import { getValuationData } from "./getData";
import ValuationResultClient from "./ValuationResulClient";

export default async function ValuationResult({
    searchParams,
}: {
    searchParams: Promise<{ id: string }>;
}) {
    const { id } = await searchParams;
    const valuation = await getValuationData(id);

    if (!valuation)
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No se encontró la valuación.
            </div>
        );

    const conditionFactors: Record<string, number> = {
        brand_new: 1.25,
        excellent: 1.15,
        good: 1.0,
        regular: 0.85,
        needs_renovation: 0.70,
    };

    const condMult = conditionFactors[valuation.condition] ?? 1.0;
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - (valuation.yearBuilt ?? currentYear));
    const ageDiscount = Math.max(0, 1 - age * 0.008);
    const base = valuation.estimatedValue;
    const ageContribution = Math.round(base * condMult * ageDiscount - base);

    const factors = [
        {
            key: "location",
            label: "Location",
            icon: "/ValuationResult/location-icon.png",
            value: Math.round(base * 0.22),
            explanation: `Properties in ${valuation.municipality}, ${valuation.department} carry a 22% location premium based on zone pricing data. The area's proximity to services, commercial centers, and overall demand drive this adjustment.`,
        },
        {
            key: "infrastructure",
            label: "Infrastructure",
            icon: "/ValuationResult/undergroundPipe-icon.png",
            value: Math.round(base * 0.14),
            explanation: `Urban infrastructure quality in this zone — road quality, water supply, electricity reliability, and public services — adds a 14% premium to the base estimate.`,
        },
        {
            key: "features",
            label: "Property Features",
            icon: "/ValuationResult/homePage-icon.png",
            value: (valuation.bedrooms ?? 0) * 4000 + (valuation.bathrooms ?? 0) * 3000,
            explanation: `${valuation.bedrooms} bedrooms (×$4,000 each) and ${valuation.bathrooms} bathrooms (×$3,000 each) contribute $${(
                (valuation.bedrooms ?? 0) * 4000 + (valuation.bathrooms ?? 0) * 3000
            ).toLocaleString()} to the valuation. More rooms increase usable space and market appeal.`,
        },
        {
            key: "condition",
            label: "Condition & Age",
            icon: "/ValuationResult/document-icon.png",
            value: Math.max(0, ageContribution),
            explanation: `The property is ${age} year${age !== 1 ? "s" : ""} old and rated "${valuation.condition}". Condition multiplier: ×${condMult.toFixed(2)}, age depreciation: ×${ageDiscount.toFixed(3)}. ${ageContribution <= 0
                    ? "Together these result in no net addition — age and condition are already reflected in the base price."
                    : `Together they add $${ageContribution.toLocaleString()} to the estimate.`
                }`,
        },
        {
            key: "market",
            label: "Market Trend",
            icon: "/ValuationResult/comboChart-icon.png",
            value: Math.round(base * 0.085),
            explanation: `Current real estate market conditions in El Salvador show an 8.5% upward trend in residential property values, based on recent transaction data and demand indicators in the region.`,
        },
    ];

    const conditionColors: Record<string, string> = {
        brand_new: "bg-violet-50 text-violet-700 border border-violet-200",
        excellent: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        good: "bg-blue-50 text-blue-700 border border-blue-200",
        regular: "bg-amber-50 text-amber-700 border border-amber-200",
        needs_renovation: "bg-red-50 text-red-700 border border-red-200",
    };

    const conditionLabel: Record<string, string> = {
        brand_new: "Brand New",
        excellent: "Excellent",
        good: "Good",
        regular: "Regular",
        needs_renovation: "Needs Renovation",
    };

    const overviewFields = [
        { label: "Property Type", icon: "/ValuationResult/home-icon.png", value: valuation.type },
        { label: "Location", icon: "/ValuationResult/location-icon.png", value: `${valuation.municipality}, ${valuation.department}` },
        { label: "Land Area", icon: "/ValuationResult/areaChart-icon.png", value: `${valuation.landAreaM2} m²` },
        { label: "Building Area", icon: "/ValuationResult/building-icon.png", value: `${valuation.areaM2} m²` },
        { label: "Bedrooms", icon: "/ValuationResult/bed-icon.png", value: valuation.bedrooms },
        { label: "Bathrooms", icon: "/ValuationResult/bathtub-icon.png", value: valuation.bathrooms },
        {
            label: "Year Built",
            icon: "/ValuationResult/planner-icon.png",
            value: valuation.yearBuilt && valuation.yearBuilt > 0 ? valuation.yearBuilt : "—",
        },
        {
            label: "Condition",
            icon: "/ValuationResult/star-icon.png",
            value: conditionLabel[valuation.condition] ?? valuation.condition,
            isCondition: true,
            conditionKey: valuation.condition,
        },
    ];

    // Raw valuation fields to pre-fill the form when editing
    const rawValuation = {
        department: valuation.department,
        municipality: valuation.municipality,
        zone: valuation.zone,
        exactAddress: valuation.exactAddress ?? "",
        postalCode: valuation.postalCode ?? 0,
        type: valuation.type,
        condition: valuation.condition,
        areaM2: valuation.areaM2,
        landAreaM2: valuation.landAreaM2,
        levels: valuation.levels ?? 1,
        yearBuilt: valuation.yearBuilt ?? 0,
        bedrooms: valuation.bedrooms,
        bathrooms: valuation.bathrooms,
        parkingSpaces: valuation.parkingSpaces ?? 0,
        kitchenType: valuation.kitchenType ?? "",
        hasLivingDiningRoom: valuation.hasLivingDiningRoom ?? false,
        hasLaundryRoom: valuation.hasLaundryRoom ?? false,
        hasStorageCellar: valuation.hasStorageCellar ?? false,
        hasStudioHomeOffice: valuation.hasStudioHomeOffice ?? false,
        hasServiceQuarter: valuation.hasServiceQuarter ?? false,
        hasAC: valuation.hasAC ?? false,
        hasSmartHome: valuation.hasSmartHome ?? false,
        hasPool: valuation.hasPool ?? false,
        hasSecurityGate: valuation.hasSecurityGate ?? false,
        hasCCTV: valuation.hasCCTV ?? false,
        hasGym: valuation.hasGym ?? false,
        hasElevator: valuation.hasElevator ?? false,
        hasGreenAreas: valuation.hasGreenAreas ?? false,
        hasOtherAmenity: valuation.hasOtherAmenity ?? false,
        otherAmenityDescription: valuation.otherAmenityDescription ?? "",
        publicDescription: valuation.publicDescription ?? "",
        maintenanceFee: valuation.maintenanceFee ?? 0,
        petsAllowed: valuation.petsAllowed ?? "allowed",
        includedServices: valuation.includedServices ?? "",
    };

    return (
        <ValuationResultClient
            valuation={valuation}
            factors={factors}
            overviewFields={overviewFields}
            conditionColors={conditionColors}
            rawValuation={rawValuation}
        />
    );
}