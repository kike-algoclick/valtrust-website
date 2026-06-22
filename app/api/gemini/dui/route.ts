import { NextResponse } from "next/server";
import { analyzeDui } from "@/lib/gemini/dui";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await analyzeDui(
      body.imageBase64,
      body.mimeType
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "DUI analysis failed"
      },
      { status: 500 }
    );
  }
}