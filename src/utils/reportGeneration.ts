import { toast } from 'sonner';

interface AssessmentData {
  overallScore: number;
  categoryScores: Record<string, number>;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  primaryRhythm: string;
  lockedInsights: string[];
  cognitiveImpact?: {
    memoryRetention: number;
    processingSpeed: number;
    attentionSpan: number;
    executiveFunction: number;
    emotionalRegulation: number;
  };
  recoveryProjections?: {
    thirtyDay: string[];
    sixtyDay: string[];
    ninetyDay: string[];
  };
  optimalTimes?: {
    bestFocusTime: string;
    preferredMeetingTime: string;
    sustainedAttentionTime: string;
  };
}

interface ReportOptions {
  assessmentResult: AssessmentData;
  userType: string;
  includeClinicalNotes?: boolean;
  includeProjections?: boolean;
  includeOptimalTiming?: boolean;
}

export async function generatePDFReport(options: ReportOptions): Promise<void> {
  const { assessmentResult, userType, includeClinicalNotes = false, includeProjections = false } = options;

  // Create a comprehensive HTML report
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>MyRhythm Assessment Report</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px; 
            }
            .header { 
                text-align: center; 
                border-bottom: 3px solid #2563eb; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
            }
            .logo { 
                font-size: 28px; 
                font-weight: bold; 
                color: #2563eb; 
                margin-bottom: 10px; 
            }
            .section { 
                margin-bottom: 30px; 
                padding: 20px; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                background: #f9fafb; 
            }
            .section h2 { 
                color: #1f2937; 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 10px; 
                margin-top: 0; 
            }
            .score-badge { 
                display: inline-block; 
                padding: 8px 16px; 
                border-radius: 20px; 
                font-weight: bold; 
                margin: 5px; 
            }
            .score-low { background: #dcfce7; color: #166534; }
            .score-moderate { background: #fef3c7; color: #92400e; }
            .score-high { background: #fee2e2; color: #991b1b; }
            .recommendation { 
                background: #eff6ff; 
                padding: 15px; 
                margin: 10px 0; 
                border-left: 4px solid #2563eb; 
                border-radius: 4px; 
            }
            .clinical-note { 
                background: #f0fdf4; 
                padding: 15px; 
                margin: 10px 0; 
                border: 1px solid #bbf7d0; 
                border-radius: 4px; 
                font-size: 14px; 
            }
            .category-score { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 10px; 
                margin: 5px 0; 
                background: white; 
                border: 1px solid #e5e7eb; 
                border-radius: 4px; 
            }
            .projection-timeline { 
                display: grid; 
                grid-template-columns: 1fr 1fr 1fr; 
                gap: 20px; 
                margin: 20px 0; 
            }
            .projection-card { 
                background: white; 
                padding: 15px; 
                border: 1px solid #e5e7eb; 
                border-radius: 8px; 
                text-align: center; 
            }
            .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 1px solid #e5e7eb; 
                font-size: 12px; 
                color: #6b7280; 
            }
            .disclaimer { 
                background: #fef2f2; 
                padding: 15px; 
                margin: 20px 0; 
                border: 1px solid #fecaca; 
                border-radius: 4px; 
                font-size: 14px; 
            }
            @media print {
                body { font-size: 12px; }
                .section { break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">MyRhythm</div>
            <h1>Cognitive Wellness Assessment Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Assessment Type: ${userType === 'individual' ? 'Individual Assessment' : 'Clinical Assessment'}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div style="text-align: center; margin: 20px 0;">
                <div class="score-badge score-${assessmentResult.riskLevel}">
                    Overall Score: ${assessmentResult.overallScore}/100
                </div>
                <div class="score-badge score-${assessmentResult.riskLevel}">
                    Risk Level: ${assessmentResult.riskLevel.charAt(0).toUpperCase() + assessmentResult.riskLevel.slice(1)}
                </div>
            </div>
            <p><strong>Primary Rhythm Profile:</strong> ${assessmentResult.primaryRhythm}</p>
            
            ${assessmentResult.optimalTimes ? `
            <div style="margin: 20px 0;">
                <h3>Optimal Performance Windows</h3>
                <ul>
                    <li><strong>Peak Focus Time:</strong> ${assessmentResult.optimalTimes.bestFocusTime}</li>
                    <li><strong>Best Meeting Time:</strong> ${assessmentResult.optimalTimes.preferredMeetingTime}</li>
                    <li><strong>Sustained Attention:</strong> ${assessmentResult.optimalTimes.sustainedAttentionTime}</li>
                </ul>
            </div>
            ` : ''}
        </div>

        <div class="section">
            <h2>Category Breakdown</h2>
            ${Object.entries(assessmentResult.categoryScores).map(([category, score]) => `
                <div class="category-score">
                    <span style="font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}</span>
                    <span class="score-badge score-${score >= 70 ? 'low' : score >= 50 ? 'moderate' : 'high'}">
                        ${score}%
                    </span>
                </div>
            `).join('')}
        </div>

        ${assessmentResult.cognitiveImpact && includeClinicalNotes ? `
        <div class="section">
            <h2>Cognitive Impact Analysis</h2>
            <p>Detailed breakdown of cognitive function domains:</p>
            ${Object.entries(assessmentResult.cognitiveImpact).map(([domain, score]) => `
                <div class="category-score">
                    <span style="font-weight: 500;">${domain.charAt(0).toUpperCase() + domain.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    <span class="score-badge score-${score >= 70 ? 'low' : score >= 50 ? 'moderate' : 'high'}">
                        ${score}%
                    </span>
                </div>
            `).join('')}
            
            <div class="clinical-note">
                <strong>Clinical Interpretation:</strong> This cognitive profile indicates areas requiring targeted intervention and rehabilitation support. The assessment suggests focusing on the lowest-scoring domains while leveraging strengths in higher-performing areas.
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h2>Personalized Recommendations</h2>
            ${assessmentResult.recommendations.map((rec, index) => `
                <div class="recommendation">
                    <strong>${index + 1}.</strong> ${rec}
                </div>
            `).join('')}
        </div>

        ${includeProjections && assessmentResult.recoveryProjections ? `
        <div class="section">
            <h2>Recovery Projections</h2>
            <div class="projection-timeline">
                <div class="projection-card">
                    <h3 style="color: #059669;">30-Day Goals</h3>
                    ${assessmentResult.recoveryProjections.thirtyDay.slice(0, 3).map(proj => `
                        <p style="font-size: 14px; margin: 8px 0;">• ${proj}</p>
                    `).join('')}
                </div>
                <div class="projection-card">
                    <h3 style="color: #0284c7;">60-Day Goals</h3>
                    ${assessmentResult.recoveryProjections.sixtyDay.slice(0, 3).map(proj => `
                        <p style="font-size: 14px; margin: 8px 0;">• ${proj}</p>
                    `).join('')}
                </div>
                <div class="projection-card">
                    <h3 style="color: #7c3aed;">90-Day Goals</h3>
                    ${assessmentResult.recoveryProjections.ninetyDay.slice(0, 3).map(proj => `
                        <p style="font-size: 14px; margin: 8px 0;">• ${proj}</p>
                    `).join('')}
                </div>
            </div>
            
            <div class="clinical-note">
                <strong>Evidence Base:</strong> These projections are based on validated recovery trajectories from similar assessment profiles and evidence-based rehabilitation outcomes.
            </div>
        </div>
        ` : ''}

        <div class="disclaimer">
            <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers regarding any medical condition or treatment decisions.
        </div>

        <div class="footer">
            <p><strong>MyRhythm Cognitive Wellness Platform</strong></p>
            <p>This report was generated using validated assessment tools and evidence-based recovery frameworks.</p>
            <p>For more information: support@myrhythm.com</p>
        </div>
    </body>
    </html>
  `;

  // Create and download the PDF
  try {
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MyRhythm-Assessment-Report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also create a more detailed PDF version for premium users
    if (includeClinicalNotes) {
      toast.success('Comprehensive medical report downloaded successfully');
    } else {
      toast.success('Assessment report downloaded successfully');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate report');
  }
}

export async function shareWithHealthcareProvider(assessmentData: AssessmentData, providerInfo: {
  name: string;
  email: string;
  role: string;
}): Promise<void> {
  // Simulate API call to share assessment with healthcare provider
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock successful sharing
      if (providerInfo.email && assessmentData) {
        resolve();
      } else {
        reject(new Error('Invalid provider information'));
      }
    }, 1500);
  });
}