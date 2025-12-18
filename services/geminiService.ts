import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FetchedMediaDetails {
    title: string;
    year: number;
    description: string;
    type: 'Pel·lícula' | 'Sèrie';
    platform: string;
    platformDomain?: string;
    duration?: number;
    seasons?: number;
    episodesPerSeason?: number[];
    posterUrl?: string;
    backdropUrl?: string;
}

export const fetchMediaDetails = async (query: string): Promise<FetchedMediaDetails> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are a high-quality movie and TV show database API. 
            Search for detailed information about: "${query}".
            
            Return ONLY a valid JSON object with the following schema:
            {
              "title": "Official title in Catalan or Spanish",
              "year": 2024,
              "description": "Short plot summary in Catalan (max 2 sentences)",
              "type": "Pel·lícula" or "Sèrie",
              "platform": "Primary streaming platform in Spain (Netflix, HBO Max, Disney+, etc.)",
              "platformDomain": "The official domain of that platform (e.g. netflix.com, max.com, disneyplus.com, primevideo.com)",
              "duration": 120, // number, for movies only
              "seasons": 1, // number, for series only
              "episodesPerSeason": [10, 10], // array of numbers, for series only
              "posterUrl": "A direct URL to a vertical poster image",
              "backdropUrl": "A direct URL to a horizontal high-quality representative scene or wallpaper"
            }
            
            IMPORTANT: Do not wrap the JSON in markdown code blocks. Do not add any conversational text. Just the raw JSON object starting with '{' and ending with '}'.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const fullText = response.text || "";
        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("El format de la resposta no és vàlid.");
        }

        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '');

        const parsedData = JSON.parse(jsonString);
        
        const rawType = String(parsedData.type || '').toLowerCase();
        if (rawType.includes('movie') || rawType.includes('pel') || rawType.includes('film')) {
            parsedData.type = 'Pel·lícula';
        } else if (rawType.includes('serie') || rawType.includes('tv') || rawType.includes('show') || rawType.includes('sèr')) {
            parsedData.type = 'Sèrie';
        } else {
            parsedData.type = 'Pel·lícula';
        }

        if (parsedData.year) parsedData.year = Number(parsedData.year);
        if (parsedData.duration) parsedData.duration = Number(parsedData.duration);
        if (parsedData.seasons) parsedData.seasons = Number(parsedData.seasons);
        if (parsedData.episodesPerSeason && !Array.isArray(parsedData.episodesPerSeason)) {
            parsedData.episodesPerSeason = [];
        }

        return parsedData as FetchedMediaDetails;

    } catch (error) {
        console.error("Error fetching media details:", error);
        throw new Error("No s'han pogut obtenir els detalls.");
    }
};