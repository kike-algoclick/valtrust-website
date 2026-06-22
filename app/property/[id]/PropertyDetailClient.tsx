"use client";

import { useRouter } from "next/navigation";

type Props = {
    property: Record<string, unknown>;
};

const verificationColors: Record<string, string> = {
    unverified: "bg-gray-100 text-gray-600 border border-gray-200",
    deed_verified: "bg-blue-50 text-blue-700 border border-blue-200",
    fully_verified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const verificationLabel: Record<string, string> = {
    unverified: "Unverified",
    deed_verified: "Deed Verified",
    fully_verified: "Fully Verified",
};

export default function PropertyDetailClient({ property }: Props) {
    const router = useRouter();

    const status = String(property.verificationStatus ?? "unverified");

    const overviewFields = [
        { label: "Bedrooms", icon: "/ValuationResult/bed-icon.png", value: String(property.rooms) },
        { label: "Bathrooms", icon: "/ValuationResult/bathtub-icon.png", value: String(property.bathrooms) },
        { label: "Building Area", icon: "/ValuationResult/building-icon.png", value: `${property.areaM2} m²` },
        { label: "Location", icon: "/ValuationResult/location-icon.png", value: String(property.location) },
    ];

    return (
        <section className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4 mt-15">
            <div className="max-w-5xl mx-auto flex flex-col gap-y-4 sm:gap-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-4 gap-3">
                    <div>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-900">Property Listing</h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Published {new Date(property.createdAt as string).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 transition-colors self-start sm:self-auto"
                    >
                        <img src="/valuationResult/arrow-icon.png" alt="" className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Dashboard</span>
                    </button>
                </div>

                {/* ── Hero Card: image + title/price ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="bg-gray-100 rounded-xl w-full lg:w-[340px] h-48 sm:h-[200px] lg:h-[220px] flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="/ValuationResult/houseExample-icon.png" alt="Property" className="object-cover w-full h-full" />
                    </div>

                    <div className="flex flex-col justify-center w-full gap-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {String(property.title)}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{String(property.location)}</p>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${verificationColors[status] ?? verificationColors.unverified}`}>
                                {verificationLabel[status] ?? "Unverified"}
                            </span>
                        </div>

                        <p className="text-2xl sm:text-3xl font-bold text-[#0B1E4A] mt-2">
                            ${Number(property.price).toLocaleString()} USD
                        </p>

                        {property.description ? (
                            <p className="text-sm text-gray-600 leading-relaxed mt-1">
                                {String(property.description)}
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* ── Bottom Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                    {/* Property Overview */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <p className="text-sm font-semibold text-gray-800 mb-4">Property Overview</p>
                        <div className="flex flex-col gap-y-3">
                            {overviewFields.map(({ label, icon, value }) => (
                                <div key={label} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-x-2 text-gray-500">
                                        <img src={icon} alt="" className="h-4 w-4 opacity-60" />
                                        <span>{label}</span>
                                    </div>
                                    <span className="text-gray-800 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address & Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <p className="text-sm font-semibold text-gray-800 mb-4">Address & Status</p>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Full Address</span>
                                <span className="text-gray-800 font-medium text-right max-w-[60%]">
                                    {property.address ? String(property.address) : "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Verification</span>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${verificationColors[status] ?? verificationColors.unverified}`}>
                                    {verificationLabel[status] ?? "Unverified"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Listing Status</span>
                                <span className="text-gray-800 font-medium capitalize">
                                    {String(property.status ?? "available")}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
