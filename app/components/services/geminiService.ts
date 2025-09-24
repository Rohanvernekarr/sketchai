import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables. Make sure NEXT_PUBLIC_GEMINI_API_KEY is set in your .env file.');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateSystemDesign(prompt: string): Promise<AIResponse> {
    try {
      const systemPrompt = `
You are an expert system architect. Generate a system design diagram based on the user's description. 
Respond with a JSON object that includes:
- title: A concise title for the system
- description: A brief description of the system
- elements: Array of system components with type, label, and optional position/size
- connections: Array of connections between components

Available element types: database, server, cloud, user, api, box

Example response format:
{
  "title": "E-commerce System",
  "description": "A scalable e-commerce platform with microservices architecture",
  "elements": [
    {"type": "user", "label": "Customer"},
    {"type": "server", "label": "Web Server"},
    {"type": "database", "label": "User Database"}
  ],
  "connections": [
    {"from": "Customer", "to": "Web Server", "label": "HTTP Requests"},
    {"from": "Web Server", "to": "User Database", "label": "Query"}
  ]
}

User prompt: ${prompt}

Generate ONLY valid JSON, no additional text:`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to extract only JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const aiResponse = JSON.parse(jsonMatch[0]) as AIResponse;
      
      // Validate the response structure
      if (!aiResponse.title || !aiResponse.elements || !aiResponse.connections) {
        throw new Error('Invalid response structure from AI');
      }
      
      return aiResponse;
    } catch (error) {
      console.error('Error generating system design:', error);
      
      // Fallback response
      return {
        title: 'System Design',
        description: 'Generated system design based on your requirements',
        elements: [
          { type: 'user', label: 'User' },
          { type: 'server', label: 'Application Server' },
          { type: 'database', label: 'Database' }
        ],
        connections: [
          { from: 'User', to: 'Application Server', label: 'Request' },
          { from: 'Application Server', to: 'Database', label: 'Query' }
        ]
      };
    }
  }
}

export const geminiService = new GeminiService();