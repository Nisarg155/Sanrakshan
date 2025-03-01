"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeContract = exports.detectAndConfirmContractType = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const redis_1 = __importDefault(require("../config/redis"));
const ai_service_1 = require("../services/ai.service");
const contract_model_1 = __importDefault(require("../models/contract.model"));
// const upload=multer({
//     storage:multer.memoryStorage(),
//     fileFilter:(req,file,cb)=>{
//         if(file.mimetype.startsWith("image/")){
//             cb(null,true);
//         }else{
//             cb(null,false)
//             cb(new Error("Only images are allowed"));
//         }
//     }
// }).single("contract")
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        // Allow only PDFs (you can add other document types if needed)
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(null, false);
            cb(new Error("Only PDF files are allowed"));
        }
    }
}).single("contract");
exports.uploadMiddleware = upload;
const detectAndConfirmContractType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!req.file) {
        return res.status(400).json({ error: "No file Uploaded" });
    }
    try {
        const fileKey = `file${user._id}:${Date.now()}`;
        // const fileKey="abckavya";
        yield redis_1.default.set(fileKey, req.file.buffer);
        yield redis_1.default.expire(fileKey, 3600);
        const pdfText = yield (0, ai_service_1.extractTextToPdf)(fileKey);
        const detectedType = yield (0, ai_service_1.detectPrivacyType)(pdfText);
        yield redis_1.default.del(fileKey);
        res.json({ detectedType });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to detect Privacy Policy type"
        });
    }
});
exports.detectAndConfirmContractType = detectAndConfirmContractType;
const analyzeContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { contractType } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    if (!contractType) {
        return res.status(400).json({ error: "No contract type provided" });
    }
    try {
        const fileKey = `file:${user._id}:${Date.now()}`;
        // const fileKey = `file:kavya:${Date.now()}`;
        yield redis_1.default.set(fileKey, req.file.buffer);
        yield redis_1.default.expire(fileKey, 3600); // 1 hour
        console.log("redis");
        const pdfText = yield (0, ai_service_1.extractTextToPdf)(fileKey);
        let analysis;
        console.log("called gemini");
        analysis = yield (0, ai_service_1.analyzeContractWithAI)(pdfText, "free", contractType);
        console.log("got anaylysis", analysis);
        if (!analysis.summary || !analysis.risks || !analysis.opportunities) {
            throw new Error("Failed to analyze contract");
        }
        const savedAnalysis = yield contract_model_1.default.create(Object.assign(Object.assign({ userId: user._id, contractText: pdfText, contractType }, analysis), { language: "en", aiModel: "gemini-pro" }));
    }
    catch (error) {
    }
});
exports.analyzeContract = analyzeContract;
