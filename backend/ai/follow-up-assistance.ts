import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { users } from "~encore/clients";
import { APIError } from "encore.dev/api";

const deepseekApiKey = secret("DeepSeekAPIKey");

export interface FollowUpAssistanceRequest {
  userEmail: string;
  originalRecommendations: string;
  specificQuestion: string;
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  concernTypes: string[];
  severityLevel: string;
}

export interface FollowUpAssistanceResponse {
  assistance: string;
  disclaimer: string;
}

// Provides follow-up assistance for implementing Tier 2 interventions.
export const followUpAssistance = api<FollowUpAssistanceRequest, FollowUpAssistanceResponse>(
  { expose: true, method: "POST", path: "/ai/follow-up-assistance" },
  async (req) => {
    // Get user's personal DeepSeek API key
    let apiKey: string;
    
    try {
      const userKeyResponse = await users.getDeepSeekKey({ email: req.userEmail });
      if (userKeyResponse.hasKey && userKeyResponse.key) {
        apiKey = userKeyResponse.key;
      } else {
        throw APIError.invalidArgument("No DeepSeek API key found. Please add your API key in your profile settings to use AI features.");
      }
    } catch (error) {
      throw APIError.invalidArgument("No DeepSeek API key available. Please add your API key in your profile settings.");
    }

    if (!apiKey) {
      throw APIError.invalidArgument("No DeepSeek API key available. Please add your API key in your profile settings.");
    }

    const concernTypesText = req.concernTypes.length > 0 
      ? req.concernTypes.join(', ')
      : 'Not specified';

    const prompt = `You are an educational specialist AI assistant providing follow-up assistance for implementing Tier 2 interventions for students who may need 504/IEP accommodations.

Context:
- Student: ${req.studentFirstName} ${req.studentLastInitial}.
- Grade: ${req.grade}
- Concern Types: ${concernTypesText}
- Severity Level: ${req.severityLevel}

Original AI-Generated Recommendations:
${req.originalRecommendations}

Teacher's Specific Question/Request for Additional Assistance:
${req.specificQuestion}

Please provide detailed, practical guidance to help the teacher implement the interventions effectively. Your response should:

1. **Direct Answer** - Address the specific question or concern raised
2. **Implementation Steps** - Provide clear, step-by-step guidance
3. **Practical Tips** - Include classroom management strategies and best practices
4. **Resources Needed** - Specify any materials, tools, or support required
5. **Timeline Considerations** - Suggest realistic timeframes for implementation
6. **Troubleshooting** - Anticipate potential challenges and provide solutions
7. **Progress Monitoring** - Explain how to track effectiveness and make adjustments
8. **When to Seek Additional Support** - Clear indicators for escalating to specialists

Focus on actionable advice that a classroom teacher can realistically implement. Use professional educational terminology while keeping explanations clear and practical. Structure your response with clear headings and bullet points for easy reading.`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an educational specialist AI assistant providing follow-up assistance for implementing Tier 2 interventions. Provide practical, detailed guidance that helps teachers successfully implement interventions in their classrooms. Focus on actionable steps, troubleshooting, and realistic implementation strategies.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`DeepSeek API error: ${response.status} - ${errorText}`);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const assistance = data.choices[0]?.message?.content || 'Unable to generate follow-up assistance at this time.';

      const disclaimer = "⚠️ IMPORTANT DISCLAIMER: This AI-generated assistance is for informational purposes only and should not replace professional educational consultation. Please work with your school's student support department, special education team, or educational specialists for comprehensive guidance. All suggestions should be reviewed and approved by qualified educational professionals before implementation.";

      return {
        assistance,
        disclaimer
      };
    } catch (error) {
      console.error('Error calling DeepSeek API for follow-up assistance:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw APIError.invalidArgument("Invalid DeepSeek API key. Please check your API key in your profile settings.");
      }
      
      return {
        assistance: 'Unable to generate follow-up assistance at this time due to a technical error. Please try again later or contact your student support department directly for implementation guidance.',
        disclaimer: "⚠️ IMPORTANT DISCLAIMER: This AI-generated assistance is for informational purposes only and should not replace professional educational consultation. Please work with your school's student support department, special education team, or educational specialists for comprehensive guidance. All suggestions should be reviewed and approved by qualified educational professionals before implementation."
      };
    }
  }
);
