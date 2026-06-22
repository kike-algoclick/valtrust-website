import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valuationId = Number(body.valuationId);
    const title = String(body.title ?? "").trim();

    if (!valuationId || !title) {
      return NextResponse.json(
        { error: "Missing valuationId or title" },
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

    if (!valuation.sellerClerkId) {
      return NextResponse.json(
        { error: "Valuation has no associated seller" },
        { status: 400 }
      );
    }

    // Evita publicar la misma Valuation dos veces (valuationId es @unique en Property)
    const existingProperty = await prisma.property.findUnique({
      where: { valuationId: valuation.id },
    });

    if (existingProperty) {
      return NextResponse.json({ success: true, property: existingProperty });
    }

    // Mapeo del estado de verificación: Valuation usa un string simple,
    // Property usa el enum PropertyVerificationStatus.
    const verificationStatus =
      valuation.verificationStatus === "valuation_verified"
        ? "fully_verified"
        : "unverified";

    const property = await prisma.property.create({
      data: {
        sellerClerkId: valuation.sellerClerkId,
        valuationId: valuation.id,
        title,
        description: valuation.publicDescription ?? "",
        location: `${valuation.municipality}, ${valuation.department}`,
        address: valuation.exactAddress ?? "",
        areaM2: valuation.areaM2,
        rooms: valuation.bedrooms,
        bathrooms: valuation.bathrooms,
        price: valuation.estimatedValue,
        verificationStatus,
      },
    });

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}