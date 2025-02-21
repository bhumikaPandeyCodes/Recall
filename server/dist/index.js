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
//IMPORTING MODULES
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const Auth_1 = require("./middleware/Auth");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// SIGNUP ENDPOINT //
app.post("/api/v1/signup", Auth_1.SignupInputVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  1. validating input using zod
    try {
        const username = req.body.username;
        const email = req.body.email;
        //2. encrypt password
        try {
            const encryptPassword = yield bcrypt_1.default.hash(req.body.password, config_1.SALT_ROUNDS);
            req.body.password = encryptPassword;
        }
        catch (error) {
            res.status(503).json({ errorType: "Bcrypt Error/ Server Error", message: "service unavailable " });
            return;
        }
        const password = req.body.password;
        const user = yield db_1.UserModal.create({
            username,
            email,
            password
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.JWT_SECRET);
            //signedup
            res.status(200).json({ succcess: true, token });
            return;
        }
    }
    catch (error) {
        console.log("----------this is catch error---------------------");
        // console.log(error)
        //-->MONGO ERROR-
        res.status(403).json({ success: false, errorType: "Input Error", message: "user already exist" });
        return;
    }
    //---> SEVER ERROR
    console.log("-----------------server error----------------------");
    res.status(500).json({ success: false, erroType: "Server Error", message: "server error" });
}));
// SIGNIN ENDPOINT //
app.post("/api/v1/signin", Auth_1.SigninInputVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //1. validated usign zod
    try {
        const email = req.body.email;
        const password = req.body.password;
        // 2. check if the email exist
        const existUser = yield db_1.UserModal.findOne({ email });
        if (existUser && existUser.password) {
            // 3. check password 
            const verifiedPass = yield bcrypt_1.default.compare(password, existUser.password);
            //4. create jwt
            if (verifiedPass) {
                const token = jsonwebtoken_1.default.sign({ id: existUser._id }, config_1.JWT_SECRET);
                res.status(200).json({ success: true, token });
                return;
            }
            else {
                res.status(403).json({ success: false, errorType: "Incorrect password", message: "Incorrect Password" });
                return;
            }
        }
        else {
            res.status(404).json({ errorType: "Input Error", message: "Email does not exist" });
            return;
        }
    }
    catch (error) {
        console.log("-----------signin error -------------");
        console.log(error);
        res.status(400).json({ message: "error" });
        return;
    }
    console.log("-----------------server error----------------------");
    res.status(500).json({ success: false, erroType: "Server Error", message: "server error" });
}));
// ADD-CONTENT ENDPOINT //
app.post("/api/v1/add-content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.body.userId
    const { userId, type, link, title, tags } = req.body;
    // console.log(userId)
    // console.log(type)
    // console.log(link)
    // console.log(title)
    // console.log(tags)
    try {
        const newContent = yield db_1.ContentModal.create({
            type,
            link,
            title,
            tags,
            userId,
        });
        if (newContent) {
            console.log("content created");
            res.status(201).json({ success: true });
        }
        else {
            console.log("content not created");
            res.status(500).json({ success: false });
        }
    }
    catch (error) {
        console.log("------------error-------------");
        res.status(500).json({ success: false, error });
        console.log(error);
    }
}));
// GET-CONTENT ENDPOINT //
app.get("/api/v1/view-content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, contentId } = req.body;
    try {
        const findContent = yield db_1.ContentModal.findOne({ _id: contentId }).populate('tags', 'name');
        if (findContent) {
            res.status(302).json({ success: true, findContent });
            return;
            // console.log(findContent)
        }
        else {
            res.status(404).json({ success: false, message: "not found" });
            // console.log("content not found")
        }
    }
    catch (error) {
        res.status(500).json({ errorType: "server side error", error });
        console.log(error);
    }
}));
// GET ALL CONENT OF USER //
app.get("/api/v1/content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const foundContents = yield db_1.ContentModal.find({ userId });
        if (foundContents) {
            res.status(200).json({ success: true, foundContents });
        }
        else {
            res.status(204).json({ success: false, message: "no contents found" });
        }
    }
    catch (error) {
        res.status(502).json({ errorType: "server error" });
    }
}));
// DELETE-CONTENT ENDPOINT //
app.delete("/api/v1/content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, contentId } = req.body;
    try {
        const deleted = yield db_1.ContentModal.deleteOne({ _id: contentId });
        res.status(302).json({ success: true });
        return;
        //expected ----------> { acknowledged: true, deletedCount: 1 }
    }
    catch (error) {
        // console.log("-----error--------")
        res.status(500).json({ success: false, message: "couldn't delete" });
        console.log(error);
    }
}));
// GENERATE A SHAREABLE LINK //
app.post("/api/v1/content/share", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share, userId } = req.body;
    if (share) {
        try {
            const linkExist = yield db_1.LinkModal.findOne({ userId });
            if (linkExist) {
                res.status(200).json(linkExist.hash);
                return;
            }
            else {
                const hash = (0, utils_1.random)(10);
                const Link = yield db_1.LinkModal.create({
                    hash,
                    userId
                });
                if (Link) {
                    //created link
                    const shareableLink = `/content/share/${hash}`;
                    res.status(201).json({ success: true, link: shareableLink });
                }
                else {
                    //unexpected error occured while creating link
                    res.status(500).json({ success: false });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        try {
            yield db_1.LinkModal.deleteOne({
                userId
            });
            //deleted
            res.status(202).json({ success: true });
        }
        catch (error) {
            //unknown error occured while deleting
            res.status(500);
            console.log(error);
            return;
        }
    }
}));
// FETCH CONTENT BY LINK //
app.get("/api/v1/content/:share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.params.share;
    try {
        const Link = yield db_1.LinkModal.findOne({ hash: share });
        if (Link) {
            const userId = Link.userId;
            if (userId) {
                const Content = yield db_1.ContentModal.find({ userId });
                if (Content) {
                    res.status(200).json({ Content });
                    console.log(Content);
                    return;
                }
                else {
                    //no content 204
                    res.status(204).json({ message: "No content found" });
                    console.log("couldnt get content");
                    return;
                }
            }
            else {
                res.status(409).json({ message: "conflict" });
                return;
            }
        }
        else {
            res.status(404).json({ message: "invalid url" });
        }
    }
    catch (error) {
        res.status(500);
        console.log(error);
    }
}));
app.listen(PORT, () => {
    console.log("listening");
});
