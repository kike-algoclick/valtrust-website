"use client";

import { useRef } from "react";
import ListingCard from "./listingcard";

type Property = {
  id: string;
  title: string;
  price: number;
  verificationStatus: "unverified" | "deed_verified" | "fully_verified";
};

export default function ListingCarousel({ properties }: { properties: Property[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (!properties.length) {
    return (
      <div className="p-5 text-sm text-gray-400">
        No listings available yet.
      </div>
    );
  }

  return (
    <div className="relative p-5">

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {properties.map((property) => (
          <ListingCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={`$${property.price.toLocaleString()}`}
            verificationStatus={property.verificationStatus}
          />
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-md w-12 transition text-black hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}
