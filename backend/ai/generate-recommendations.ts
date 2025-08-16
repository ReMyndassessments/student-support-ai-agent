import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const deepseekApiKey = secret("DeepSeekAPIKey");

export interface GenerateRecommendationsRequest {
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  teacher: string;
  concernDescription: string;
  additionalInfo?: string;
}

export interface GenerateRecommendationsResponse {
  recommendations: string;
  disclaimer: string;
}

// Generates Tier 2 intervention recommendations based on student information and concerns.
export const generateRecommendations = api<GenerateRecommendationsRequest, GenerateRecommendationsResponse>(
  { expose: true, method: "POST", path: "/ai/recommendations" },
  async (req) => {
    const prompt = `You are an educational specialist AI assistant helping teachers with Tier 2 intervention recommendations for students who may need 504/IEP accommodations.

Student Information:
- Name: ${req.studentFirstName} ${req.studentLastInitial}.
- Grade: ${req.grade}
- Teacher: ${req.teacher}
- Concern Description: ${req.concernDescription}
${req.additionalInfo ? `- Additional Information: ${req.additionalInfo}` : ''}

Please provide specific, actionable Tier 2 intervention recommendations that a teacher could implement in the classroom. Focus on evidence-based strategies that address the described concerns.

Format your response as follows:
1. Start with a brief summary of the student's needs
2. Provide 4-6 specific intervention strategies
3. For each strategy, include:
   - Strategy name/title
   - Clear implementation steps
   - Expected outcomes
   - Timeline for implementation

Use professional educational terminology and ensure recommendations are practical and classroom-friendly. Structure your response with clear headings and bullet points for easy reading.`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey()}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an educational specialist AI assistant helping teachers with Tier 2 intervention recommendations for students who may need 504/IEP accommodations. Provide practical, evidence-based classroom strategies in a professional, well-structured format with clear headings and implementation details.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const recommendations = data.choices[0]?.message?.content || 'Unable to generate recommendations at this time.';

      const disclaimer = "⚠️ IMPORTANT DISCLAIMER: These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation.";

      return {
        recommendations,
        disclaimer
      };
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      
      return {
        recommendations: 'Unable to generate recommendations at this time due to a technical error. Please try again later or contact your student support department directly.',
        disclaimer: "⚠️ IMPORTANT DISCLAIMER: These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation."
      };
    }
  }
);
