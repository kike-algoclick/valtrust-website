import { NextResponse } from "next/server";
import { verifyProperty } from "@/lib/gemini/veryfy"

export async function POST(req: Request) {
  const { deedJson, excerptJson } = await req.json();

  if (!deedJson || !excerptJson) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  const result = await verifyProperty(deedJson, excerptJson);

  return NextResponse.json(result);
}