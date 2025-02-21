//IMPORTING MODULES
import express from "express"
import { UserModal,ContentModal, LinkModal } from "./db"
import cors from 'cors'
import jwt, { JwtPayload } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { JWT_SECRET, SALT_ROUNDS } from "./config"
import {SignupInputVerify,SigninInputVerify, verifyUserToken} from "./middleware/Auth"
import {random} from "./utils"
const app = express()
const PORT = 3000
app.use(express.json())
app.use(cors())
// SIGNUP ENDPOINT //

app.post("/api/v1/signup",SignupInputVerify, async(req,res)=>{

//  1. validating input using zod
    try{
            const username = req.body.username
            const email = req.body.email

            //2. encrypt password
                try{
                    const encryptPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS)
                    req.body.password = encryptPassword
                }
                catch(error){
                    res.status(503).json({errorType: "Bcrypt Error/ Server Error",message: "service unavailable "})
                    return;
                }

            const password = req.body.password
            
            const user = await UserModal.create({
                username,
                email,
                password
            })
            if(user){
                const token = jwt.sign({id: user._id}, JWT_SECRET)
                //signedup
                 res.status(200).json({ succcess: true, token})
                 return 
            }
    }
    catch(error){
        console.log("----------this is catch error---------------------")
        // console.log(error)
        //-->MONGO ERROR-
         res.status(403).json({success: false,errorType:"Input Error" ,message: "user already exist"})
         return 
    }
    //---> SEVER ERROR
    console.log("-----------------server error----------------------")
    res.status(500).json({success: false,erroType:"Server Error" ,message: "server error"})
})

// SIGNIN ENDPOINT //
app.post("/api/v1/signin",SigninInputVerify, async (req,res)=>{
    //1. validated usign zod

    try{
        const email = req.body.email
        const password = req.body.password

        // 2. check if the email exist
        const existUser = await UserModal.findOne({email})
        if(existUser && existUser.password){

            // 3. check password 
            const verifiedPass = await bcrypt.compare(password, existUser.password)

            //4. create jwt
            if(verifiedPass){
                const token = jwt.sign({id: existUser._id}, JWT_SECRET)
                res.status(200).json({success: true, token})
                return;
            }
            else{
                res.status(403).json({success:false, errorType: "Incorrect password", message: "Incorrect Password"})
                return;
            }
        }
        else{
            res.status(404).json({errorType: "Input Error", message: "Email does not exist"})
            return;
        }
    }
    catch(error){
        console.log("-----------signin error -------------")
        console.log(error)
        res.status(400).json({message: "error"})
        return;
    }
    console.log("-----------------server error----------------------")
    res.status(500).json({success: false,erroType:"Server Error" ,message: "server error"})

})

// ADD-CONTENT ENDPOINT //
app.post("/api/v1/add-content",verifyUserToken ,async (req,res)=>{
    // const userId = req.body.userId
    const {userId, type, link, title, tags} = req.body
    // console.log(userId)
    // console.log(type)
    // console.log(link)
    // console.log(title)
    // console.log(tags)
    try{
        const newContent = await ContentModal.create({ 
            type,
            link,
            title,
            tags,
            userId,
        })
        if(newContent){
            console.log("content created")
            res.status(201).json({success: true})
        }
        else{
            console.log("content not created")
            res.status(500).json({success:false})
        }
    }
    catch(error){
        console.log("------------error-------------")
        res.status(500).json({success: false, error})
        console.log(error)
    }

})

// GET-CONTENT ENDPOINT //
app.get("/api/v1/view-content", verifyUserToken,async(req,res)=>{
    const {userId, contentId} = req.body
    try{
        const findContent = await ContentModal.findOne(
            {_id: contentId}
        ).populate('tags','name')

        if(findContent)
        {   
            res.status(302).json({success: true, findContent})
            return;
            // console.log(findContent)
        }
        else{
            res.status(404).json({success:false, message:"not found"})
            // console.log("content not found")
        }
    }
    catch(error){
        res.status(500).json({errorType: "server side error",error})
        console.log(error)
    }
})

// GET ALL CONENT OF USER //
app.get("/api/v1/content",verifyUserToken, async (req, res)=>{
    
    const userId = req.body.userId
    try{
       const foundContents = await ContentModal.find({userId})
       if(foundContents){
        res.status(200).json({success:true, foundContents})
       }
       else{
        res.status(204).json({success: false, message:"no contents found"})
       }
    }
    catch(error){
        res.status(502).json({errorType: "server error"})
    }

})


// DELETE-CONTENT ENDPOINT //
app.delete("/api/v1/content",verifyUserToken, async (req,res)=>{
    const {userId, contentId} = req.body
    try{
        const deleted = await ContentModal.deleteOne({_id: contentId})
        res.status(302).json({success:true})
        return;
        //expected ----------> { acknowledged: true, deletedCount: 1 }
    }
    catch(error){
        // console.log("-----error--------")
        res.status(500).json({success:false, message: "couldn't delete"})
        console.log(error)
    }
})

// GENERATE A SHAREABLE LINK //
app.post("/api/v1/content/share",verifyUserToken ,async(req, res)=>{
    const {share, userId} = req.body

    if(share){
        try{
            const linkExist = await LinkModal.findOne({userId})
            if(linkExist)
            {
                res.status(200).json(linkExist.hash)
                return
            }
            else{
                const hash = random(10)
                const Link = await LinkModal.create({
                    hash,
                    userId
                })
                if(Link){
                    //created link
                    const shareableLink = `/content/share/${hash}`
                    res.status(201).json({success:true, link: shareableLink })
                }
                else{
                    //unexpected error occured while creating link
                    res.status(500).json({success:false})
                }
            }
        }
        catch(error){
            console.log(error)
        }
    }
    else{
        try{
            await LinkModal.deleteOne({
                userId
            })
            //deleted
            res.status(202).json({success:true})
        }
        catch(error){
            //unknown error occured while deleting
            res.status(500)
            console.log(error)
            return;
        }
    }

})

// FETCH CONTENT BY LINK //
app.get("/api/v1/content/:share", async(req,res)=>{
    const share = req.params.share
    try{
        const Link = await LinkModal.findOne({hash:share})
        if(Link){

            const userId = Link.userId
            if(userId){
                const Content = await ContentModal.find({userId})
                if(Content)
                {
                    res.status(200).json({Content})
                    console.log(Content)
                    return
                }
                else{
                    //no content 204
                    res.status(204).json({message: "No content found"})
                    console.log("couldnt get content")
                    return
                }
            }
            else{
                res.status(409).json({message: "conflict"})
                return
            }
        }
        else{
            res.status(404).json({message: "invalid url"})
        }
    }
    catch(error){
        res.status(500)
        console.log(error)
    }

})





app.listen(PORT, ()=>{
    console.log("listening")
})
