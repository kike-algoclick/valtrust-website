import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("VERIFY BODY:", body);

    const valuationId = Number(body.valuationId);
    const { verification } = body;

    if (!valuationId || !verification) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 1. Buscar si existe
    const existing = await prisma.valuation.findUnique({
      where: { id: valuationId },
    });

    console.log("EXISTS:", existing);

    if (!existing) {
      return NextResponse.json(
        { error: "Valuation not found" },
        { status: 404 }
      );
    }

    // 2. Decidir estado
    const isVerified = verification.verified === true;

    // 3. ACTUALIZAR EN BASE DE DATOS
    const updatedValuation = await prisma.valuation.update({
      where: { id: valuationId },
      data: {
        verificationStatus: isVerified
          ? "valuation_verified"
          : "unverified",
      },
    });

    // 4. Responder
    return NextResponse.json({
      success: true,
      valuation: updatedValuation,
      verificationStatus: updatedValuation.verificationStatus,
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}