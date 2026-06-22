import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
console.log("NEXT_PUBLIC_GEMINI_API_KEY =", process.env.NEXT_PUBLIC_GEMINI_API_KEY);
console.log("WINDOW?", typeof window);

const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GEMINI_API
);

const model = genAI.getGenerativeModel({
    model : 'gemini-2.5-flash'
});

export default model