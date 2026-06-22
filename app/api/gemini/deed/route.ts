import { analyzeDeed } from "@/lib/gemini/analyzer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await analyzeDeed(body.text);

    return Response.json(result);

  } catch (error) {
    console.error("DEED ERROR:", error);

    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}