"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type PropertyCardData = {
    id: string;
    title: string;
    price: number;
    location: string;
    verificationStatus: "unverified" | "deed_verified" | "fully_verified";
};

export default function PropertyCard({ property }: { property: PropertyCardData }) {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const isVerified = property.verificationStatus !== "unverified";

    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="relative w-full h-40 bg-sky-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
                    <rect x="9" y="13" width="6" height="8" />
                </svg>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setLiked((prev) => !prev);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                >
                    <svg className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "fill-none text-gray-400"}`} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm">{property.title}</p>
                <p className="text-gray-700 font-bold text-sm mt-0.5">
                    ${property.price.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{property.location}</p>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                        {isVerified ? (
                            <>
                                <svg className="w-4 h-4 text-blue-500 fill-blue-500" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-blue-500 text-xs font-medium">Verified</span>
                            </>
                        ) : (
                            <span className="text-gray-400 text-xs">Unverified</span>
                        )}
                    </div>
                    <button
                        onClick={() => router.push(`/property/${property.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                    >
                        More...
                    </button>
                </div>
            </div>
        </div>
    );
}
