import { analyzeExcerpt } from "@/lib/gemini/exctracted";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await analyzeExcerpt(body.text);

    return Response.json(result);

  } catch (error) {
    console.error("EXCERPT ERROR:", error);

    return Response.json(
      {
        success: false,
        error: String(error)
      },
      { status: 500 }
    );
  }
}