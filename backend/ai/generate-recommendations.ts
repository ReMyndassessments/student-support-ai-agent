import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { users } from "~encore/clients";
import { APIError } from "encore.dev/api";

const deepseekApiKey = secret("DeepSeekAPIKey");

export interface GenerateRecommendationsRequest {
  userEmail: string;
  studentFirstName: string;
  studentLastInitial: string;
  grade: string;
  teacher: string;
  teacherPosition: string;
  incidentDate: string;
  location: string;
  concernTypes: string[];
  otherConcernType?: string;
  concernDescription: string;
  severityLevel: string;
  actionsTaken: string[];
  otherActionTaken?: string;
}

export interface GenerateRecommendationsResponse {
  recommendations: string;
  disclaimer: string;
}

// Generates Tier 2 intervention recommendations based on student information and concerns.
export const generateRecommendations = api<GenerateRecommendationsRequest, GenerateRecommendationsResponse>(
  { expose: true, method: "POST", path: "/ai/recommendations" },
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
      ? req.concernTypes.join(', ') + (req.otherConcernType ? `, ${req.otherConcernType}` : '')
      : 'Not specified';
    
    const actionsTakenText = req.actionsTaken.length > 0 
      ? req.actionsTaken.join(', ') + (req.otherActionTaken ? `, ${req.otherActionTaken}` : '')
      : 'None documented';

    const prompt = `You are an educational specialist AI assistant helping teachers with Tier 2 intervention recommendations for students who may need 504/IEP accommodations.

Student Information:
- Name: ${req.studentFirstName} ${req.studentLastInitial}.
- Grade: ${req.grade}
- Teacher: ${req.teacher} (${req.teacherPosition})
- Incident Date: ${req.incidentDate}
- Location: ${req.location}
- Type of Concern: ${concernTypesText}
- Severity Level: ${req.severityLevel}
- Actions Already Taken: ${actionsTakenText}
- Detailed Description: ${req.concernDescription}

Based on the concern type(s) identified (${concernTypesText}) and severity level (${req.severityLevel}), please provide specific, actionable Tier 2 intervention recommendations that a teacher could implement in the classroom. Focus on evidence-based strategies that address the described concerns.

Format your response as follows:
1. **Assessment Summary** - Brief analysis of the student's needs based on the concern type and severity
2. **Immediate Interventions** (1-2 weeks) - Quick strategies to implement right away
3. **Short-term Strategies** (2-6 weeks) - More comprehensive interventions
4. **Long-term Support** (6+ weeks) - Sustained support strategies
5. **Progress Monitoring** - How to track effectiveness
6. **When to Escalate** - Clear indicators for referring to student support team

For each strategy, include:
- Strategy name/title
- Clear implementation steps
- Expected outcomes
- Timeline for implementation
- Materials/resources needed

Use professional educational terminology and ensure recommendations are practical and classroom-friendly. Structure your response with clear headings and bullet points for easy reading.`;

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
              content: 'You are an educational specialist AI assistant helping teachers with Tier 2 intervention recommendations for students who may need 504/IEP accommodations. Provide practical, evidence-based classroom strategies in a professional, well-structured format with clear headings and implementation details. Tailor recommendations based on the specific concern types and severity level provided.'
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
      const recommendations = data.choices[0]?.message?.content || 'Unable to generate recommendations at this time.';

      const disclaimer = "⚠️ IMPORTANT DISCLAIMER: These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation.";

      return {
        recommendations,
        disclaimer
      };
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw APIError.invalidArgument("Invalid DeepSeek API key. Please check your API key in your profile settings.");
      }
      
      return {
        recommendations: 'Unable to generate recommendations at this time due to a technical error. Please try again later or contact your student support department directly.',
        disclaimer: "⚠️ IMPORTANT DISCLAIMER: These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation."
      };
    }
  }
);
