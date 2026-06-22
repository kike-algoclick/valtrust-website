import model from "./geminiModel";

function safeParseJSON(text: string) {
  if (!text) throw new Error("Empty Gemini response");

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found");
  }

  return JSON.parse(
    cleaned.slice(start, end + 1)
  );
}

export async function analyzeExcerpt(ocrText: string) {
  const prompt = `
You are a legal document analyzer specialized in Salvadoran real estate documents.

Your task is to analyze OCR text.

STEP 1:
Determine whether the document is related to real estate property.

STEP 2:
Determine the exact document type.

Allowed values:

- EXCERPT_CERTIFICATION

If the document is not an EXCERPT_CERTIFICATION return:

{
  "success": false,
  "documentType": "<detected_type>",
  "reason": "Expected EXCERPT_CERTIFICATION"
}

If the document IS an EXCERPT_CERTIFICATION return:

{
  "success": true,
  "documentType": "EXCERPT_CERTIFICATION",

  "property": {
    "matricula": null,
    "type": null,
    "area": null,
    "location": null
  },

  "owner": {
    "name": null,
    "ownershipPercentage": null
  },

  "encumbrances": {
    "mortgage": null,
    "restrictions": null,
    "alerts": null
  }
}

EXTRACTION RULES:

- owner.name must contain the registered owner's full name.
- matricula must contain the property registration number.
- area must contain the property area if present.
- location must contain the property location if present.
- mortgage should be true if the document indicates a mortgage exists.
- mortgage should be false if the document explicitly states there is no mortgage.
- restrictions should be true if restrictions exist.
- restrictions should be false if the document explicitly states there are no restrictions.
- alerts should be true if alerts exist.
- alerts should be false if the document explicitly states there are no alerts.
- If information is missing, return null.

Return ONLY valid JSON.
Do not explain.
Do not use markdown.

OCR TEXT:

${ocrText}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });
    console.log(
      "Excertp TOKENS",
    result.response.usageMetadata
  );

    const text = result.response.text();

    return safeParseJSON(text);

  } catch (error: any) {
  console.error("❌ Gemini Deed Analysis Failed");
  console.error(error);

  return {
    success: false,
    documentType: "OTHER",
    reason: error?.message || "Unknown error",
  };
}
}