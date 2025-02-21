import mongoose from 'mongoose'
import {MONGO_URI} from './config'
import { string } from 'zod'

mongoose.connect(MONGO_URI)

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true} ,
    password: {type: String},
})

const TagsSchema = new mongoose.Schema({
    name: {type: String, unique: true}
})

const ContentSchema = new mongoose.Schema({
    type: {type: String},
    link: String,
    title:String,
    tags: [{type: mongoose.Types.ObjectId, ref:'tags'}],
    userId: {type: mongoose.Types.ObjectId, ref:'users'}

})

const LinkSchema = new mongoose.Schema({
    hash: {type: String},
    userId: {type:mongoose.Types.ObjectId, ref:'users', unique:true}
})  


export const UserModal =  mongoose.model("users", UserSchema)
export const TagsModal = mongoose.model("tags",TagsSchema)
export const ContentModal = mongoose.model("content", ContentSchema)
export const LinkModal = mongoose.model("link", LinkSchema)