import multer from 'multer'
import { IUser } from '../models/user.model';
import { Request, Response } from 'express';
import redis from '../config/redis';
import { analyzeContractWithAI, detectPrivacyType, extractTextToPdf } from '../services/ai.service';
import ContractAnalysisSchema,{ IContractAnalysis } from '../models/contract.model';

const upload=multer({
    storage:multer.memoryStorage(),
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null,true);
        }else{
            cb(null,false)
            cb(new Error("Only images are allowed"));
        }
    }
}).single("contract")

export const uploadMiddleware=upload


export const detectAndConfirmContractType=async(req:Request,res:Response)=>{
    const user=req.user as IUser

    if(!req.file){
        return res.status(400).json({error:"No file Uploaded"})
    }

    try {
        const fileKey=`file${user._id}:${Date.now()}`
        await redis.set(fileKey,req.file.buffer)
        await redis.expire(fileKey,3600)

        const pdfText=await extractTextToPdf(fileKey)
        const detectedType=await detectPrivacyType(pdfText)

        await redis.del(fileKey);

        res.json({detectedType})
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error:"Failed to detect Privacy Policy type"
        })
    }
}

export const analyzeContract = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { contractType } = req.body;
  
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    if (!contractType) {
      return res.status(400).json({ error: "No contract type provided" });
    }
  
    try {
      const fileKey = `file:${user._id}:${Date.now()}`;
      await redis.set(fileKey, req.file.buffer);
      await redis.expire(fileKey, 3600); // 1 hour
  
      const pdfText = await extractTextToPdf(fileKey);
      let analysis:IContractAnalysis;
      
      analysis=await analyzeContractWithAI(pdfText,"free",contractType) 
      
      if(!analysis.summary || !analysis.risks || !analysis.opportunities){
        throw new Error("Failed to analyze contract");
      }

      const savedAnalysis=await ContractAnalysisSchema.create({
        userId:user._id,
        contractText:pdfText,
        contractType,
        ...(analysis as Partial<IContractAnalysis>),
        language:"en",
        aiModel:"gemini-pro"
      })
    }catch(error){

    }
}