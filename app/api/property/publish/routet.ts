import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { valuationId, verificationStatus, sellerClerkId } = body;

    if (!valuationId) {
      return NextResponse.json(
        { error: "Missing valuationId" },
        { status: 400 }
      );
    }

    const valuation = await prisma.valuation.findUnique({
      where: { id: valuationId },
    });

    if (!valuation) {
      return NextResponse.json(
        { error: "Valuation not found" },
        { status: 404 }
      );
    }

    const property = await prisma.property.create({
      data: {
        title: `${valuation.type} in ${valuation.municipality}`,
        description: valuation.publicDescription || "",
        location: valuation.municipality,
        address: valuation.exactAddress || "",
        areaM2: valuation.areaM2,
        rooms: valuation.bedrooms,
        bathrooms: valuation.bathrooms,
        price: valuation.estimatedValue,
        sellerClerkId: sellerClerkId,
        valuationId: valuation.id,
        verificationStatus: verificationStatus ?? "unverified",
      },
    });

    return NextResponse.json({
      success: true,
      propertyId: property.id,
    });
  } catch (error) {
    console.error("PUBLISH ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}