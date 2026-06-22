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

export async function analyzeDeed(ocrText: string) {
  const prompt = `
You are a legal document analyzer specialized in Salvadoran real estate documents.

Your task is to analyze OCR text.

STEP 1:
Determine whether the document is related to real estate.

STEP 2:
Determine the document type.

Allowed values:

- DEED


If the document is not a DEED return:

{
  "success": false,
  "documentType": "<detected_type>",
  "reason": "Expected DEED"
}

If the document is a DEED return:

{
  "success": true,
  "documentType": "DEED",
  "deedDate":null,

  "property": {
    "matricula": null,
    "type": null,
    "area": null,
    "location": null
  },

  "seller": {
    "name": null,
    "dui": null,
    "nit": null,
  },

  "buyer": {
    "name": null,
    "dui": null,
    "age":null
  },

  "sale": {
    "price": null
  },

  "encumbrances": {
    "mortgage": null,
    "embargo": null,
    "restrictions": null
  }
}

Return ONLY valid JSON.
No markdown.
No explanation.

deedDate must be returned in ISO format YYYY-MM-DD.
Example: 2026-05-30
If the date cannot be determined return null.

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
      "DEED TOKENS",
      result.response.usageMetadata
    );

    const text = result.response.text();

    return safeParseJSON(text);

  }catch (error: any) {
  console.error("❌ Gemini Deed Analysis Failed");
  console.error(error);

  return {
    success: false,
    documentType: "OTHER",
    reason: error?.message || "Unknown error",
  };
}
}