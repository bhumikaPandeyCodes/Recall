//IMPORTING MODULES
import express from "express"
import multer from "multer"
import validator from "validator"
import { UserModal,ContentModal, LinkModal, TagsModal } from "./db"
import cors from 'cors'
import jwt, { JwtPayload, verify } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { JWT_SECRET, SALT_ROUNDS, PORT } from "./config"
import {SignupInputVerify, verifyUserToken} from "./middleware/Auth"
import {capitalName, random} from "./utils"
const app = express()
app.use(express.json())
app.use(cors())

const storage = multer.memoryStorage()
const upload = multer({storage})

app.get("/",(req,res)=>{
    res.send("Backend is running!")
})

// SIGNUP ENDPOINT //
app.post("/api/v1/signup",SignupInputVerify, async(req,res)=>{

//  1. validating input using zod
    try{
            const username = capitalName(req.body.username)
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
app.post("/api/v1/signin", async (req,res)=>{

        const userIdentity = req.body.userIdentity
        const password = req.body.password

        async function validateUser(query: Record<string,string>){
        // 2. check if the email exist
        try{
        console.log("checking email")
        console.log(query)
            const existUser = await UserModal.findOne(query)
            console.log(existUser)
            if(existUser && existUser.password){
                // console.log("found user now checking password")
                // 3. check password 
                const verifiedPass = await bcrypt.compare(password, existUser.password)
    
                //4. create jwt
                if(verifiedPass){
                    console.log("password is correct")
                    const token = jwt.sign({id: existUser._id}, JWT_SECRET)
                    res.status(200).json({success: true, token})
                    return;
                }
                else{
                    console.log("password wasnt correct")
                    res.status(403).json({success:false, errorType: "jwt", error: "username/email or password is wrong"})
                    return;
                }
            }
            else{
                res.status(403).json({success:false, errorType: "jwt", error: "username/email or password is wrong"})
            }
        }
    catch(error){
        console.log("-----------signin error -------------")
        console.log(error)
        res.status(400).json({message: "error"})
        return;
    }
}

    if(validator.isEmail(userIdentity)){
        validateUser({email: userIdentity})
        console.log("this was email")
    }
    else{
        validateUser({username: userIdentity})
        console.log("this is username")
    }
    
})

// ADD-IMAGE ENDPOINT
app.put("/api/v1/upload-image",upload.single("profile") ,verifyUserToken, async(req,res)=>{
    const userId = req.body.userId
    try {
        
        if(req.file){

            const response = await UserModal.updateOne({
                _id: userId
            }, {
                image: req.file.buffer
            })
            if(response){
                console.log(response)
                res.status(200).json(response)
            }
            else{
                console.log("couldnt upload file")
                res.status(300)
            }
        }
    } 
    catch (error) {
        console.log("error while uploading image")
        console.log(error)
        res.status(304).json(error)
    }
})

// GET-USER-INFO (for sidebar)
app.get("/api/v1/user-info",verifyUserToken,async(req,res)=>{
    const userId = req.body.userId
    try {
        
        const response = await UserModal.findOne({_id: userId}).select("username email image")
        if(response){
            // res.set("Content-Type","image/png")
            res.status(200).json(response)
            // console.log(response)
        }
        else{
            res.status(401).json({message:"please login again"})
            console.log("couldn't get response")
        }

    } catch (error) {
        res.status(404).json({message:"please login again"})
        console.log(error)
        
    }
})

// GET TAGS //
app.get("/api/v1/get-tags",async(req,res)=>{
    
    try{

        const tags = await TagsModal.find()
        if(tags){
            // console.log(tags)
            const tagsNames = tags.map((tag)=>tag.name)
            res.status(200).json({tags:tagsNames})
        }
        else{
            res.status(204)
            console.log(tags)
        }

    }
    catch(error){
        res.status(404)
        console.log(error)
    }
})


// ADD-CONTENT ENDPOINT //
app.post("/api/v1/add-content",verifyUserToken ,async (req,res)=>{
    // const userId = req.body.userId
    const {type, link, title, tags} = req.body.newContent
    const userId = req.body.userId
    // console.log(userId)
    // console.log(type)
    // console.log(link)
    // console.log(title)
    // console.log(tags) 

    try{
    const existingTags = await TagsModal.find({name: {$in: tags}})
    const existingTagsName = existingTags.map((tag)=> tag.name)
    const existingTagIds = existingTags.map((tag)=> tag._id)
    const newTags = tags.filter((tag:string)=>!existingTagsName.includes(tag))
    const InsertNewTags = await TagsModal.insertMany(newTags.map((tag:string)=>({name:tag})))
    const newTagsId = InsertNewTags.map((tag)=>tag._id)
    const tagIds = [...existingTagIds, ...newTagsId]
    // console.log(tagId)

        const newContent = await ContentModal.create({ 
            type,
            link,
            title,
            userId,
            tags: tagIds,
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

// GET-PARTICULAR CONTENT ENDPOINT //
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

// GET ALL CONTENT OF USER //
app.get("/api/v1/content",verifyUserToken, async (req, res)=>{
    const userId = req.body.userId
    const type = req.query.type
    try{
        let foundContents
    if(type==="all"){

        foundContents  = await ContentModal.find({userId}).populate({path:'userId', select: 'username'}).populate('tags','name')
    }
    else{
            foundContents = await ContentModal.find({userId, type}).populate({path:'userId', select: 'username'}).populate('tags','name')
        console.log(foundContents)

    }
        if(foundContents.length==0){
            console.log(foundContents)
            // console.log("content not found")
            const user = await UserModal.findOne({_id:userId})
            if(user){
                let username = user.username
                res.status(200).json({foundContents,username})
                // console.log("user exist but content doesnt")
            }
            else{
                // console.log("user doesnt exist")
                console.log(user)
                console.log()
                res.status(404)
            }
        }
        else{
            // console.log("foundcontent exist")
            // console.log(foundContents[0])
           let username = (foundContents[0]?.userId as {_id: string, username: string}).username
        res.status(200).json({foundContents, username })
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
        if(deleted)
        res.status(200).json({success:true})
        else
        res.status(500)
        //expected ----------> { acknowledged: true, deletedCount: 1 }
    }
    catch(error){
        // console.log("-----error--------")
        res.status(500).json({success:false})
        console.log(error)
    }
})

// GENERATE A SHAREABLE LINK //
app.post("/api/v1/content/share",verifyUserToken ,async(req, res)=>{
    const {share, userId} = req.body

    if(share){
        try{

            const contentExist = await ContentModal.find({userId})
            if(contentExist.length==0){
                // console.log("content does not exist ")
                res.status(200).json({success:false})
            }
            else{   
                // console.log("content exist ")
                const linkExist = await LinkModal.findOne({userId})
                if(linkExist)
                    {
                        console.log("link already exist ")
                        const shareableLink = `/${linkExist.hash}`
                        res.status(200).json({success:true, link: shareableLink})
                        return
                    }
                    else{
                        // console.log("link created ")
                        const hash = random(10)
                        const Link = await LinkModal.create({
                            hash,
                            userId
                        })
                        if(Link){
                            // console.log("link created succesfuly")
                            //created link
                            const shareableLink = `/${hash}`
                            res.status(200).json({success:true, link: shareableLink })
                        }
                        else{
                            // console.log("link not created")
                            //unexpected error occured while creating link
                            res.status(500).json({success:false})
                        }
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
    const share = req.params.share.replace(":","")
    // console.log(share)
    try{
        const Link = await LinkModal.findOne({hash:share})
        if(Link){

            const userId = Link.userId
            if(userId){
                const content = await ContentModal.find({userId}).populate('userId','username').populate('tags','name')
                if(content)
                {
                    const username = (content[0].userId as {_id:string, username: string}).username
                    res.status(200).json({content, username})
                    // console.log(content)
                    return
                }
                else{
                    const user = await UserModal.findOne({_id: userId})
                    //no content 204
                    if(user){
                        res.status(200).json({content,username: user.username})
                        // console.log("user exist but content doesnt")
                    }
                    else{
                        // console.log("user doesnt exist")
                        res.status(404)
                    }
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



const server = app.listen(PORT, ()=>{
    console.log("listening")
})
const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };
  
  // Handle termination signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);