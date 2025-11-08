import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponse } from "../types";

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Gemini API key not found in environment variables. Make sure NEXT_PUBLIC_GEMINI_API_KEY is set in your .env file.",
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateSystemDesign(prompt: string): Promise<AIResponse> {
    try {
      const systemPrompt = `
      You are an expert system architect. Generate a detailed and production-grade system design diagram based on the user's description.

      Respond with a well-structured JSON object that includes:
      - title: A concise title for the system
      - description: A brief description of the system, mentioning architecture style (e.g., microservices, monolith, serverless)
      - elements: Array of system components with type, label, and optional position/size. Include high-level components such as database, server, cloud, user, api, box, and also allow components like cache, load balancer, message queue, storage if applicable.
      - Each element should include an optional "details" key with a 1-line purpose or technology (e.g., Redis, S3, NGINX, API Gateway)
      - connections: Array of flows between components with from, to, and label explaining data flow or protocol (e.g., HTTPS, gRPC, WebSocket, SQL query)
      - Try to capture real-world architecture patterns such as authentication, caching, load balancing, scaling, and external services if relevant.

      Available element types: database, server, cloud, user, api

      Example response format:
      {
        "title": "E-commerce System",
        "description": "A scalable e-commerce platform using microservices architecture",
        "elements": [
          {"type": "user", "label": "Customer"},
          {"type": "server", "label": "Web Server"},
          {"type": "database", "label": "User Database"},
          {"type": "api", "label": "Redis Cache", "details": "Improves read performance"}
        ],
        "connections": [
          {"from": "Customer", "to": "Web Server", "label": "HTTPS Request"},
          {"from": "Web Server", "to": "User Database", "label": "SQL Query"},
          {"from": "Web Server", "to": "Redis Cache", "label": "Read / Write Cache"}
        ]
      }

      User prompt: ${prompt}

      Generate the most realistic system design based on user's input. Be precise and technical.
      `;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // ✅ Token usage logs
      const usage = response?.usageMetadata;
      console.log("Gemini Token Usage:");
      console.log("Prompt Tokens:", usage?.promptTokenCount);
      console.log("Completion Tokens:", usage?.candidatesTokenCount);
      console.log("Total Tokens:", usage?.totalTokenCount);
      console.log("-------------------------------------");

      // Clean the response to extract only JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from AI");
      }

      const aiResponse = JSON.parse(jsonMatch[0]) as AIResponse;

      // Validate the response structure
      if (
        !aiResponse.title ||
        !aiResponse.elements ||
        !aiResponse.connections
      ) {
        throw new Error("Invalid response structure from AI");
      }

      return aiResponse;
    } catch (error) {
      console.error("Error generating system design:", error);

      // Fallback response
      return {
        title: "System Design",
        description: "Generated system design based on your requirements",
        elements: [
          { type: "user", label: "User" },
          { type: "server", label: "Application Server" },
          { type: "database", label: "Database" },
        ],
        connections: [
          { from: "User", to: "Application Server", label: "Request" },
          { from: "Application Server", to: "Database", label: "Query" },
        ],
      };
    }
  }
}

export const geminiService = new GeminiService();
