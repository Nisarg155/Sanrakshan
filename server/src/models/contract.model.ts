import mongoose, {Schema} from "mongoose";
import {IUser} from "./user.model";

interface IRisk {
    risk: string;
    explanation: string;
    severity: "low" | "medium" | "high";
}

interface IOpportunity {
    opportunity: string;
    explanation: string;
    impact: "low" | "medium" | "high";
}


interface IDataSharing {
    entity: string;
    purpose: string;
}


interface ICompensationStructure {
    baseSalary: string;
    bonuses: string;
    equity: string;
    otherBenefits: string;
}


//suggestion by gemini , (ex. How should you login , ex. Never use your google auth, bcoz they access your gdrive)
export interface IContractAnalysis extends Document {
    userId: IUser["_id"];
    contractText: string;
    privacyRisks: IRisk[];

    summary: string;
    recommendations: string[];
    keyClauses: string[];

    overallScore: number;
    intellectualPropertyClauses: string | string[];
    createdAt: Date;
    version: number;
    userFeedback: {
        rating: number;
        comments: string;
    };
    customFields: { [key: string]: string };
    expirationDate: Date;
    language: string;
    aiModel: string;


    datadataCollected: string[];
    dataUsage: string[];
    dataSharing: IDataSharing[];
    userRights: string[];
    dataRetentionPeriod: string[];
    trackingTechnologies: string[];
    policyJurisdiction: string[];
    gdprCompliance: boolean,
    ccpaCompliance: boolean,
    otherRegulations: string[],

}


const ContractAnalysisSchema: Schema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    contractText: {type: String, required: true},
    privacyRisks: [{risk: String, explanation: String, severity: String}],
    // opportunities: [{ opportunity: String, explanation: String, impact: String }],
    summary: {type: String, required: true},
    recommendations: [{type: String}],
    keyClauses: [{type: String}],

    overallScore: {type: Number, min: 0, max: 100},

    intellectualPropertyClauses: {
        type: Schema.Types.Mixed,
        validate: {
            validator: function (v: any) {
                return (
                    typeof v === "string" ||
                    (Array.isArray(v) && v.every((item) => typeof item === "string"))
                );
            },
            message: (props: { value: any }) =>
                `${props.value} is not a valid string or array of strings!`,
        },
    },
    createdAt: {type: Date, default: Date.now},
    version: {type: Number, default: 1},
    userFeedback: {
        rating: {type: Number, min: 1, max: 5},
        comments: String,
    },
    customFields: {type: Map, of: String},
    expirationDate: {type: Date, required: false},
    language: {type: String, default: "en"},
    aiModel: {type: String, default: "gemini-pro"},
    dataCollected: [{type: String}],
    dataUsage: [{type: String}],
    dataSharing: [
        {
            entity: {type: String, required: true},
            purpose: {type: String, required: true},
        },
    ],
    userRights: [{type: String}],
    dataRetentionPeriod: {type: String},
    trackingTechnologies: [{type: String}],
    policyJurisdiction: [{type: String}],
    gdprCompliance: {type: Boolean, default: false},
    ccpaCompliance: {type: Boolean, default: false},
    otherRegulations: [{type: String}],
});

export default mongoose.model<IContractAnalysis>(
    "ContractAnalysis",
    ContractAnalysisSchema
);