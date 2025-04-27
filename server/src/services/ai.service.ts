import { GoogleGenerativeAI } from "@google/generative-ai";
import redis from "../config/redis";
import pdf from "pdf-parse";

// const AI_MODEL="gemini-pro"
const AI_MODEL="gemini-2.0-flash";
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const aiModel = genai.getGenerativeModel({ model: AI_MODEL });

export const extractTextToPdf = async (filekey: string) => {
  try {
    const fileData = await redis.get(filekey);
    if (!fileData) {
      throw new Error("File not found");
    }

    let fileBuffer: Buffer;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = fileData;
    } else if (typeof fileData === "object" && fileData !== null) {
      const bufferData = fileData as { type?: string; data?: number[] };
      if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
        fileBuffer = Buffer.from(bufferData.data);
      } else {
        throw new Error("Invalid file data");
      }
    } else {
      throw new Error("Invalid file data");
    }

    // Use pdf-parse to extract text from the PDF
    const data = await pdf(fileBuffer);
    const text = data.text;  // The text extracted from the PDF

    return text;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to extract text from pdf. error: ${JSON.stringify(error)}`);
  }
};

export const detectPrivacyType = async (privacyText: string): Promise<string> => {
  const prompt = `
  Analyze the following contract text and determine the type of contract it is.
  If the contract type is (eg "Privacy Policy" , "Terms and Condition","Privacy Notice" etc.) return Privacy Policy or Terms and Condition only else Return Other.
  Do not include any additional explanation or text.

  Contract text: ${privacyText.substring(0, 2000)}
  `;

  const result = await aiModel.generateContent(prompt);
  const response = result.response;
  return response.text().trim();
};

export const analyzeContractWithAI = async (
  contractText: string,
  tier: "free" | "premium",
  contractType: string
) => {
  let prompt;
  if (tier === "premium") {
    prompt = `
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 10 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 10 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

    Format your response as a JSON object with the following structure:
    {
    "overallScore": "Give overall score to this policy from 0-100%",
  "privacyRisks": [
    {
      "risk": "Describe the identified risk",
      "explanation": "Provide a brief explanation of why this is a risk",
      "severity": "low | medium | high"
    }
  ],
  "summary": "Provide a comprehensive summary of the privacy policy",
  "recommendations": [
    "Based on the app's privacy policy, give clear and actionable recommendations for end users who will be using this app. The goal is to help them understand how to protect their privacy and use the app safely. Analyze the permissions and data usage mentioned, and advise users on best practices—such as when to limit or disable certain permissions.

For example, if the policy mentions requesting continuous access to sensitive features like the camera, location, or microphone, advise users to be cautious. Suggest only granting access when necessary, and disabling permissions when not in use—unless the user fully trusts the app.

Ensure the recommendations are generalizable and tailored based on what the policy actually says, rather than being static or biased toward one specific permission type."
  ],
  "keyClauses": [
    "List important clauses relevant to data privacy and security"
  ],
  "legalCompliance": "Assess whether the privacy policy complies with GDPR, CCPA, and other relevant regulations",
  "dataCollected": [
    "List the types of data collected as mentioned in the policy"
  ],
  "dataUsage": [
    "Describe how the collected data is used"
  ],
  "dataSharing": [
    {
      "entity": "Name of the third-party entity data is shared with",
      "purpose": "Explain why data is shared with this entity"
    }
  ],
  "userRights": [
    "List the rights given to users regarding their data"
  ],
  "dataRetentionPeriod": "Specify how long the data is retained",
  "trackingTechnologies": [
    "List any tracking technologies used, such as cookies or web beacons"
  ],
  "policyJurisdiction": [
    "Specify the legal jurisdiction governing the privacy policy"
  ],
  "gdprCompliance": true | false,
  "ccpaCompliance": true | false,
  "otherRegulations": [
    "Mention any other applicable regulations"
  ]
}
    `;
  } else {
    prompt = `
   Analyze the following ${contractType} contract and provide:
    1. A list of at least 5 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 5 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

    Format your response as a JSON object with the following structure:
    {
    "overallScore": "Give overall score to this policy from 0-100%",
  "privacyRisks": [
    {
      "risk": "Describe the identified risk",
      "explanation": "Provide a brief explanation of why this is a risk",
      "severity": "low | medium | high"
    }
  ],
  "summary": "Provide a comprehensive summary of the privacy policy",
  "recommendations": [
    "Based on the app's privacy policy, give clear and actionable recommendations for end users who will be using this app. The goal is to help them understand how to protect their privacy and use the app safely. Analyze the permissions and data usage mentioned, and advise users on best practices—such as when to limit or disable certain permissions.

For example, if the policy mentions requesting continuous access to sensitive features like the camera, location, or microphone, advise users to be cautious. Suggest only granting access when necessary, and disabling permissions when not in use—unless the user fully trusts the app.

Ensure the recommendations are generalizable and tailored based on what the policy actually says, rather than being static or biased toward one specific permission type."
  ],
  "keyClauses": [
    "List important clauses relevant to data privacy and security"
  ],
  "legalCompliance": "Assess whether the privacy policy complies with GDPR, CCPA, and other relevant regulations",
  "dataCollected": [
    "List the types of data collected as mentioned in the policy"
  ],
  "dataUsage": [
    "Describe how the collected data is used"
  ],
  "dataSharing": [
    {
      "entity": "Name of the third-party entity data is shared with",
      "purpose": "Explain why data is shared with this entity"
    }
  ],
  "userRights": [
    "List the rights given to users regarding their data"
  ],
  "dataRetentionPeriod": "Specify how long the data is retained",
  "trackingTechnologies": [
    "List any tracking technologies used, such as cookies or web beacons"
  ],
  "policyJurisdiction": [
    "Specify the legal jurisdiction governing the privacy policy"
  ],
  "gdprCompliance": true | false,
  "ccpaCompliance": true | false,
  "otherRegulations": [
    "Mention any other applicable regulations"
  ]
}
    `; 
  }

  prompt += `
    Important: Provide only the JSON object in your response, without any additional text or formatting.

    Contract text:
    ${contractText}
  `;

  const results = await aiModel.generateContent(prompt);
  const response = results.response;
  let text = response.text();

  // remove any markdown formatting
  text = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    // Attempt to fix common JSON errors

    
    text = text.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // Ensure all keys are quoted
    text = text.replace(/:\s*"([^"]*)"([^,}\]])/g, ': "$1"$2'); // Ensure all string values are properly quoted
    text = text.replace(/,\s*}/g, "}"); // Remove trailing commas

    const analysis = JSON.parse(text);
    // console.log("My analysis",analysis);
    
    return analysis;
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }

  interface IPrivacyRisk {
    risk: string;
    explanation: string;
    severity: "low" | "medium" | "high";
  }
  
  interface IDataSharing {
    entity: string;
    purpose: string;
  }
  
  interface IPrivacyAnalysis {
    privacyRisks: IPrivacyRisk[];
    summary: string;
    recommendations: string[];
    keyClauses: string[];
    legalCompliance: string;
    dataCollected: string[];
    dataUsage: string[];
    dataSharing: IDataSharing[];
    userRights: string[];
    dataRetentionPeriod: string;
    trackingTechnologies: string[];
    policyJurisdiction: string[];
    gdprCompliance: boolean;
    ccpaCompliance: boolean;
    otherRegulations: string[];
  }
  
  const privacyAnalysis: IPrivacyAnalysis = {
    privacyRisks: [],
    summary: "Error analyzing privacy policy",
    recommendations: [],
    keyClauses: [],
    legalCompliance: "Unknown",
    dataCollected: [],
    dataUsage: [],
    dataSharing: [],
    userRights: [],
    dataRetentionPeriod: "Unknown",
    trackingTechnologies: [],
    policyJurisdiction: [],
    gdprCompliance: false,
    ccpaCompliance: false,
    otherRegulations: [],
  };
  
  // Extract privacy risks
  const risksMatch = text.match(/"privacyRisks"\s*:\s*\[([\s\S]*?)\]/);
  if (risksMatch) {
    privacyAnalysis.privacyRisks = risksMatch[1].split("},").map((risk: string) => {
      const riskMatch = risk.match(/"risk"\s*:\s*"([^"]*)"/);
      const explanationMatch = risk.match(/"explanation"\s*:\s*"([^"]*)"/);
      const severityMatch = risk.match(/"severity"\s*:\s*"(low|medium|high)"/);
      return {
        risk: riskMatch ? riskMatch[1] : "Unknown",
        explanation: explanationMatch ? explanationMatch[1] : "Unknown",
        severity: severityMatch ? (severityMatch[1] as "low" | "medium" | "high") : "low",
      };
    });
  }
  
  // Extract summary
  const summaryMatch = text.match(/"summary"\s*:\s*"([^"]*)"/);
  if (summaryMatch) {
    privacyAnalysis.summary = summaryMatch[1];
  }
  
  // Extract recommendations
  const recommendationsMatch = text.match(/"recommendations"\s*:\s*\[([\s\S]*?)\]/);
  if (recommendationsMatch) {
    privacyAnalysis.recommendations = recommendationsMatch[1]
      .split(",")
      .map((rec) => rec.replace(/"/g, "").trim());
  }
  
  // Extract key clauses
  const keyClausesMatch = text.match(/"keyClauses"\s*:\s*\[([\s\S]*?)\]/);
  if (keyClausesMatch) {
    privacyAnalysis.keyClauses = keyClausesMatch[1]
      .split(",")
      .map((clause) => clause.replace(/"/g, "").trim());
  }
  
  // Extract legal compliance
  const legalComplianceMatch = text.match(/"legalCompliance"\s*:\s*"([^"]*)"/);
  if (legalComplianceMatch) {
    privacyAnalysis.legalCompliance = legalComplianceMatch[1];
  }
  
  // Extract data collected
  const dataCollectedMatch = text.match(/"dataCollected"\s*:\s*\[([\s\S]*?)\]/);
  if (dataCollectedMatch) {
    privacyAnalysis.dataCollected = dataCollectedMatch[1]
      .split(",")
      .map((data) => data.replace(/"/g, "").trim());
  }
  
  // Extract data sharing
  const dataSharingMatch = text.match(/"dataSharing"\s*:\s*\[([\s\S]*?)\]/);
  if (dataSharingMatch) {
    privacyAnalysis.dataSharing = dataSharingMatch[1].split("},").map((share: string) => {
      const entityMatch = share.match(/"entity"\s*:\s*"([^"]*)"/);
      const purposeMatch = share.match(/"purpose"\s*:\s*"([^"]*)"/);
      return {
        entity: entityMatch ? entityMatch[1] : "Unknown",
        purpose: purposeMatch ? purposeMatch[1] : "Unknown",
      };
    });
  }
  
  // Extract GDPR and CCPA compliance
  const gdprMatch = text.match(/"gdprCompliance"\s*:\s*(true|false)/);
  if (gdprMatch) {
    privacyAnalysis.gdprCompliance = gdprMatch[1] === "true";
  }
  
  const ccpaMatch = text.match(/"ccpaCompliance"\s*:\s*(true|false)/);
  if (ccpaMatch) {
    privacyAnalysis.ccpaCompliance = ccpaMatch[1] === "true";
  }
  
  return privacyAnalysis;

}