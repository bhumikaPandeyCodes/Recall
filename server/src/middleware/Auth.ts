import express, {Request, Response ,NextFunction } from "express";
import zod from 'zod'
import bcrypt from 'bcrypt'
import jwt, {JwtPayload} from 'jsonwebtoken'
import { SALT_ROUNDS, JWT_SECRET } from "../config";
const app = express()


export async function SignupInputVerify(req:Request,res:Response,next:NextFunction){

        try{

            const requiredBody = zod.object({
                username: zod.string()
                .min(5,{message: "username is too short"})
                .max(15, "username cannot have more than 10 characters"),
        
                email: zod.string().email(),
        
                password: zod.string()
                .min(8,{message:"password should have atleast 8 characters"})
                .max(20,{message:"password cannot have more than 10 characters"})
                .regex(/[A-Z]/,{message:"password must contain atleast one capital character"})
                .regex(/[a-z]/,{message: "password must contain atleast one lowercase character"})
                .regex(/[0-9]/,{message:"password must contain atleast one number"})
                .regex(/[@$!%*?&#]/,{message: "password must contain atleast one special character"})
            })
        const validateBody = requiredBody.safeParse(req.body)
        console.log(validateBody)
        if(validateBody.success){
            next()
         }
         else{
            res.status(400).json({message: "invalid input | bad request", error:validateBody.error.issues[0].message})
         }

        }
        catch(error){
            res.status(503).json({message: "service unavailabe"})
        }

}

export async function SigninInputVerify(req:Request,res:Response,next:NextFunction){

        try{
            const requiredBody = zod.object({
                email: zod.string().email(),
        
                password: zod.string()
                .min(8,{message:"password should have atleast 8 characters"})
                .max(20,{message:"password cannot have more than 10 characters"})
                .regex(/[A-Z]/,{message:"password must contain atleast one capital character"})
                .regex(/[a-z]/,{message: "password must contain atleast one lowercase character"})
                .regex(/[0-9]/,{message:"password must contain atleast one number"})
                .regex(/[@$!%*?&#]/,{message: "password must contain atleast one special character"})
            })
        const validateBody = requiredBody.safeParse(req.body)
        if(validateBody.success){
            next()
         }
         else{
            res.status(400).json({message: "invalid input | bad request"})
         }

        }
        catch(error){
            res.status(503).json({message: "service unavailabe"})
        }

}

export async function verifyUserToken(req:Request, res:Response, next: NextFunction){
    
    try{
        const token = req.headers.authorization
        if(token)
            {
            const decodedData = jwt.verify(token as string, JWT_SECRET)
            if(token){
                req.body.userId = (decodedData as JwtPayload).id
                next()
            }
            else{
                res.json({message: "Invalid token"})
                return;
            }
        }
        else{
            // console.log("-------------token does not exist--------")
            res.status(400).json({message: "token does not exist | not logged in"})
            return;
        }
    }
        catch(error)
        {
            console.log(error)
            res.json({error})
            return;
        }
    
}