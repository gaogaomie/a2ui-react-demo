import { buildGeminiSystemPrompt } from "@/llm/prompts-gemini";
import axios from "axios";

const VECTOR_ENGINE_URL =
  "https://api.vectorengine.ai/v1beta/models/gemini-2.5-pro:generateContent";

const A2UI_SCHEMA = {
  type: "OBJECT",
  properties: {
    surfaceUpdate: {
      type: "OBJECT",
      properties: {
        surfaceId: { type: "STRING" },
        components: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              component: { type: "OBJECT" },
            },
          },
        },
      },
    },
    dataModelUpdate: {
      type: "OBJECT",
      properties: {
        contents: { type: "OBJECT" },
      },
    },
    beginRendering: {
      type: "OBJECT",
      properties: {
        surfaceId: { type: "STRING" },
        root: { type: "STRING" },
        catalogId: { type: "STRING" },
      },
    },
    deleteSurface: {
      type: "OBJECT",
      properties: {
        surfaceId: { type: "STRING" },
      },
    },
  },
};

export async function generateProject1(
  userInput: string,
  history: { role: "user" | "model"; text: string }[] = [],
) {
  const payload = {
    contents: [
      //   ...history.map((m) => ({
      //     role: m.role,
      //     parts: [{ text: m.text }],
      //   })),
      {
        role: "user",
        parts: [{ text: buildGeminiSystemPrompt(userInput) }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      responseSchema: A2UI_SCHEMA,
    },
  };

  const response = await axios.post(VECTOR_ENGINE_URL, payload, {
    headers: {
      Authorization: `Bearer ${process.env.VECTOR_ENGINE_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  //   const part = [
  //     {
  //       text: '{"message":"好的，为您找到了纽约评分最高的5家餐厅：","ui":[{"type":"list\',\'title\':" \n}\n]\n}',
  //     },
  //   ];
  //   const text = part[0].text;

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  console.log("Gemini response:", text);

  return text;
}
