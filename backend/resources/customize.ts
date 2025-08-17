import { api } from "encore.dev/api";
import { resourceDB } from "./db";
import { APIError } from "encore.dev/api";

export interface CustomizeResourceRequest {
  resourceId: number;
  customizations: {
    studentName?: string;
    grade?: string;
    specificGoals?: string[];
    timeframe?: string;
    additionalNotes?: string;
  };
}

export interface CustomizeResourceResponse {
  customizedContent: string;
  originalTitle: string;
  suggestions: string[];
}

// Customizes a resource template based on specific student needs and AI recommendations.
export const customize = api<CustomizeResourceRequest, CustomizeResourceResponse>(
  { expose: true, method: "POST", path: "/resources/:resourceId/customize" },
  async (req) => {
    // Get the original resource
    const resource = await resourceDB.queryRow<{
      id: number;
      title: string;
      content: string;
      is_customizable: boolean;
    }>`
      SELECT id, title, content, is_customizable FROM resources WHERE id = ${req.resourceId}
    `;

    if (!resource) {
      throw APIError.notFound("Resource not found");
    }

    if (!resource.is_customizable) {
      throw APIError.invalidArgument("This resource cannot be customized");
    }

    // Apply customizations to the content
    let customizedContent = resource.content;
    const suggestions: string[] = [];

    // Replace placeholder fields
    if (req.customizations.studentName) {
      customizedContent = customizedContent.replace(
        /_______________/g, 
        req.customizations.studentName
      );
      customizedContent = customizedContent.replace(
        /Student: _______________/g, 
        `Student: ${req.customizations.studentName}`
      );
      customizedContent = customizedContent.replace(
        /\*\*Name:\*\* _______________/g, 
        `**Name:** ${req.customizations.studentName}`
      );
    }

    if (req.customizations.grade) {
      customizedContent = customizedContent.replace(
        /Grade: _______________/g, 
        `Grade: ${req.customizations.grade}`
      );
      customizedContent = customizedContent.replace(
        /\*\*Grade:\*\* _______________/g, 
        `**Grade:** ${req.customizations.grade}`
      );
    }

    // Add specific goals if provided
    if (req.customizations.specificGoals && req.customizations.specificGoals.length > 0) {
      const goalsSection = `\n## Specific Goals for This Student\n${req.customizations.specificGoals.map((goal, index) => `${index + 1}. ${goal}`).join('\n')}\n`;
      customizedContent = customizedContent.replace(
        /## Student Information/,
        `${goalsSection}\n## Student Information`
      );
      
      suggestions.push("Consider reviewing these specific goals weekly to track progress");
      suggestions.push("Adjust strategies based on goal achievement");
    }

    // Add timeframe information
    if (req.customizations.timeframe) {
      const timeframeSection = `\n## Implementation Timeframe\n**Target Duration:** ${req.customizations.timeframe}\n`;
      customizedContent += timeframeSection;
      
      suggestions.push(`Plan to review effectiveness after ${req.customizations.timeframe}`);
    }

    // Add additional notes
    if (req.customizations.additionalNotes) {
      const notesSection = `\n## Additional Notes\n${req.customizations.additionalNotes}\n`;
      customizedContent += notesSection;
    }

    // Add current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    customizedContent = customizedContent.replace(
      /Date: _______________/g,
      `Date: ${currentDate}`
    );
    customizedContent = customizedContent.replace(
      /\*\*Date Created:\*\* _______________/g,
      `**Date Created:** ${currentDate}`
    );

    // Add general suggestions based on resource type
    if (resource.title.toLowerCase().includes('behavior')) {
      suggestions.push("Start with positive reinforcement before implementing consequences");
      suggestions.push("Involve the student in creating their behavior goals");
      suggestions.push("Communicate regularly with parents about progress");
    }

    if (resource.title.toLowerCase().includes('academic')) {
      suggestions.push("Begin with the student's current skill level");
      suggestions.push("Provide multiple ways to demonstrate understanding");
      suggestions.push("Celebrate small wins to build confidence");
    }

    if (resource.title.toLowerCase().includes('social')) {
      suggestions.push("Practice skills in low-pressure situations first");
      suggestions.push("Use peer modeling when appropriate");
      suggestions.push("Provide immediate feedback during practice");
    }

    // Add customization footer
    const customizationFooter = `\n---\n*This resource was customized on ${currentDate} for ${req.customizations.studentName || 'this student'}.*\n*Original template: ${resource.title}*`;
    customizedContent += customizationFooter;

    return {
      customizedContent,
      originalTitle: resource.title,
      suggestions
    };
  }
);
