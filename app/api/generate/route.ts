import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { Flashcard } from '@/lib/types';

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "API_KEY environment variable not set" }, { status: 500 });
  }

  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "No text provided for processing" }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    You are an expert study assistant called Gnarpy. Your purpose is to analyze text and create high-quality flashcards.
    Please analyze the following document text and generate a JSON array of flashcard objects.
    **JSON Format Rules:**
    1. The output MUST be a valid JSON array of objects.
    2. Each object MUST have exactly two keys: "question" and "answer".
    3. The values for "question" and "answer" MUST be strings.
    4. Ensure there are no trailing commas anywhere in the JSON output.
    5. The response MUST NOT contain any text outside of the JSON array. It should start with '[' and end with ']'.
    6. Do NOT wrap the JSON in markdown fences like \`\`\`json.
    **Example of valid output:**
    [
      {
        "question": "What is the primary topic of the document?",
        "answer": "The primary topic is..."
      },
      {
        "question": "Identify a key concept mentioned.",
        "answer": "A key concept is..."
      }
    ]
    **Text to Analyze:**
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData: Flashcard[] = JSON.parse(jsonStr);
    
    if (!Array.isArray(parsedData) || (parsedData.length > 0 && parsedData.some(item => typeof item.question !== 'string' || typeof item.answer !== 'string'))) {
       throw new Error('Invalid flashcard data format received from API.');
    }
      
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Error in /api/generate:", error);
    let errorMessage = "Failed to generate flashcards from API.";
    if (error instanceof SyntaxError) {
        errorMessage = `Failed to parse JSON response from the API. The format was likely invalid.`;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
