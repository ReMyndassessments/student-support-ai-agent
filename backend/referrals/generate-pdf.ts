import { api } from "encore.dev/api";
import { referralDB } from "./db";
import { APIError } from "encore.dev/api";

export interface GeneratePDFRequest {
  referralId: number;
}

export interface GeneratePDFResponse {
  pdfContent: string; // Base64 encoded PDF
  filename: string;
}

// Generates a PDF report for a referral suitable for student support meetings.
export const generatePDF = api<GeneratePDFRequest, GeneratePDFResponse>(
  { expose: true, method: "POST", path: "/referrals/:referralId/pdf" },
  async (req) => {
    const referral = await referralDB.queryRow<{
      id: number;
      student_first_name: string;
      student_last_initial: string;
      grade: string;
      teacher: string;
      teacher_position: string;
      incident_date: string;
      location: string;
      concern_types: string;
      other_concern_type: string | null;
      concern_description: string;
      severity_level: string;
      actions_taken: string;
      other_action_taken: string | null;
      ai_recommendations: string | null;
      created_at: Date;
    }>`
      SELECT * FROM referrals WHERE id = ${req.referralId}
    `;

    if (!referral) {
      throw APIError.notFound("Referral not found");
    }

    const concernTypes = JSON.parse(referral.concern_types);
    const actionsTaken = JSON.parse(referral.actions_taken);

    // Create HTML content for PDF generation
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Support Referral - ${referral.student_first_name} ${referral.student_last_initial}.</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #f3f4f6;
            padding: 10px 15px;
            border-left: 4px solid #2563eb;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
        }
        .info-value {
            margin-top: 5px;
            padding: 8px;
            background-color: #f9fafb;
            border-radius: 4px;
        }
        .concern-description {
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 15px 0;
        }
        .recommendations {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            margin: 15px 0;
        }
        .recommendations h3 {
            color: #1e40af;
            margin-top: 0;
        }
        .recommendations h4 {
            color: #1e40af;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .recommendations ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .recommendations li {
            margin-bottom: 5px;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            font-size: 12px;
            margin-right: 8px;
            margin-bottom: 4px;
        }
        .severity-mild { background-color: #d1fae5; color: #065f46; }
        .severity-moderate { background-color: #fef3c7; color: #92400e; }
        .severity-urgent { background-color: #fee2e2; color: #991b1b; }
        .disclaimer {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            font-size: 12px;
            color: #991b1b;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Student Support Referral</h1>
        <p><strong>Concern2Care</strong> - AI-Powered Student Support System</p>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
    </div>

    <div class="section">
        <div class="section-title">Student Information</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Student Name:</div>
                <div class="info-value">${referral.student_first_name} ${referral.student_last_initial}.</div>
            </div>
            <div class="info-item">
                <div class="info-label">Grade:</div>
                <div class="info-value">${referral.grade}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Teacher:</div>
                <div class="info-value">${referral.teacher}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Position:</div>
                <div class="info-value">${referral.teacher_position}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Incident Details</div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Date of Incident:</div>
                <div class="info-value">${new Date(referral.incident_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Location:</div>
                <div class="info-value">${referral.location}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Severity Level:</div>
                <div class="info-value">
                    <span class="badge severity-${referral.severity_level.toLowerCase()}">
                        ${referral.severity_level.charAt(0).toUpperCase() + referral.severity_level.slice(1)}
                    </span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Referral ID:</div>
                <div class="info-value">#${referral.id}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Concern Types</div>
        <div style="margin: 15px 0;">
            ${concernTypes.map((type: string) => `<span class="badge">${type}</span>`).join('')}
            ${referral.other_concern_type ? `<span class="badge">${referral.other_concern_type}</span>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">Concern Description</div>
        <div class="concern-description">
            ${referral.concern_description}
        </div>
    </div>

    ${actionsTaken.length > 0 || referral.other_action_taken ? `
    <div class="section">
        <div class="section-title">Actions Already Taken</div>
        <div style="margin: 15px 0;">
            ${actionsTaken.map((action: string) => `<span class="badge">${action}</span>`).join('')}
            ${referral.other_action_taken ? `<span class="badge">${referral.other_action_taken}</span>` : ''}
        </div>
    </div>
    ` : ''}

    ${referral.ai_recommendations ? `
    <div class="section">
        <div class="section-title">AI-Generated Tier 2 Intervention Recommendations</div>
        <div class="recommendations">
            ${formatRecommendationsForPDF(referral.ai_recommendations)}
        </div>
        <div class="disclaimer">
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> These AI-generated recommendations are for informational purposes only and should not replace professional educational assessment. Please refer this student to your school's student support department for proper evaluation and vetting. All AI-generated suggestions must be reviewed and approved by qualified educational professionals before implementation.
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Generated by Concern2Care from Remynd | Submitted: ${referral.created_at.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
    </div>
</body>
</html>`;

    // Convert HTML to PDF using a simple base64 encoding approach
    // In a real implementation, you would use a library like Puppeteer or similar
    const pdfContent = Buffer.from(htmlContent).toString('base64');
    
    const filename = `student-referral-${referral.student_first_name}-${referral.student_last_initial}-${referral.id}.pdf`;

    return {
      pdfContent,
      filename
    };
  }
);

function formatRecommendationsForPDF(text: string): string {
  const lines = text.split('\n');
  let html = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      html += '<br>';
      continue;
    }
    
    // Check for follow-up assistance section
    if (trimmedLine === '--- FOLLOW-UP ASSISTANCE ---') {
      html += '<div style="border-top: 2px solid #3b82f6; margin-top: 20px; padding-top: 15px;"><h3 style="color: #1e40af;">Follow-up Implementation Assistance</h3></div>';
      continue;
    }
    
    if (trimmedLine.startsWith('Teacher\'s Question:')) {
      html += `<div style="background-color: #dbeafe; padding: 10px; border-radius: 6px; margin: 10px 0;"><strong>Teacher's Question:</strong> ${trimmedLine.replace('Teacher\'s Question:', '').trim()}</div>`;
      continue;
    }
    
    if (trimmedLine === 'Additional Guidance:') {
      html += '<h4 style="color: #1e40af; margin-top: 15px;">Additional Guidance:</h4>';
      continue;
    }
    
    // Main headings
    if (trimmedLine.startsWith('##') || trimmedLine.startsWith('# ')) {
      html += `<h3>${trimmedLine.replace(/^#+\s*/, '')}</h3>`;
      continue;
    }
    
    // Sub-headings
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      html += `<h4>${trimmedLine.replace(/\*\*/g, '')}</h4>`;
      continue;
    }
    
    // Numbered lists
    if (/^\d+\./.test(trimmedLine)) {
      html += `<div style="margin: 8px 0; font-weight: 500;">${trimmedLine}</div>`;
      continue;
    }
    
    // Bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      html += `<ul style="margin: 5px 0;"><li>${trimmedLine.replace(/^[-•]\s*/, '')}</li></ul>`;
      continue;
    }
    
    // Regular paragraphs
    html += `<p style="margin: 10px 0;">${trimmedLine}</p>`;
  }
  
  return html;
}
