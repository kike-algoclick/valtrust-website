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

export async function analyzeDui(
  base64Image: string,
  mimeType: string
) {
  const prompt = `
You are an identity document analyzer.

Your task is to analyze an image and determine whether it is a Salvadoran DUI (Documento Único de Identidad).

STEP 1:
Determine the document type.

Allowed values:

- DUI

If the document is not a DUI return:

{
  "success": false,
  "documentType": "<detected_type>",
  "reason": "Expected DUI"
}

If the document IS a DUI return:

{
  "success": true,
  "documentType": "DUI",

  "person": {
    "fullName": null,
    "dui": null,
    "birthDate": null,
    "age": null
  }
}

EXTRACTION RULES:

- fullName must contain the complete name exactly as written.
- dui must contain the DUI number.

- birthDate must be returned in ISO format YYYY-MM-DD.
  Example: 2007-12-01.
  If the date cannot be identified return null.

- If birthDate is available, calculate the person's age and return it in age.
- Do not return null for age if it can be calculated from birthDate.
- If birthDate cannot be identified, return null for age.
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
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
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
      "DUI TOKENS",
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