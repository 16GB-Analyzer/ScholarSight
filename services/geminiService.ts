
import { GoogleGenAI, Type } from "@google/genai";
import type { Explanation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        simpleExplanation: {
            type: Type.STRING,
            description: "A very simple, ELI5-style explanation of the paper's core idea.",
        },
        methodology: {
            type: Type.STRING,
            description: "A summary of the methodology, techniques, and algorithms used in the research.",
        },
        datasets: {
            type: Type.STRING,
            description: "A description of the datasets used for experiments, including their names and key characteristics.",
        },
        algorithms: {
            type: Type.STRING,
            description: "A detailed explanation of the key algorithms and their purpose in the paper. If no specific algorithms are mentioned, state that clearly.",
        },
        keyContributions: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of the main contributions or novel findings of the paper.",
        },
        potentialApplications: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING 
            },
            description: "A list of potential real-world applications for this research.",
        },
        referenceHelper: {
            type: Type.STRING,
            description: "A paragraph summarizing the paper's key points, formatted to be easily used in the references/related work section of another paper.",
        },
    },
    required: ["simpleExplanation", "methodology", "datasets", "algorithms", "keyContributions", "potentialApplications", "referenceHelper"],
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return reject(new Error('FileReader did not return a string.'));
            }
            // result is "data:application/pdf;base64,...."
            // We need to strip the prefix
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
};


export async function explainPaper(file: File): Promise<Explanation> {
  try {
    const base64Data = await fileToBase64(file);

    const filePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    };

    const textPart = {
      text: "Please analyze the following computer science research paper PDF and provide a structured breakdown. Explain any algorithms mentioned in detail. Focus on clarifying the complex concepts for someone building their own research paper."
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: { parts: [textPart, filePart] },
      config: {
        systemInstruction: "You are an expert research assistant specializing in computer science. Your task is to dissect academic papers and present the information in a clear, structured JSON format, making it easy for other researchers to understand and cite the work.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Explanation;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get explanation from the AI model.");
  }
}

export async function rephraseText(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please rephrase and elaborate on the following text in simple, easy-to-understand terms for a non-expert. Break down any jargon and use analogies if helpful. \n\nTEXT TO EXPLAIN:\n"""\n${text}\n"""`,
       config: {
        systemInstruction: "You are a helpful assistant that simplifies complex topics.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for rephrasing:", error);
    throw new Error("Failed to get rephrased text from the AI model.");
  }
}
