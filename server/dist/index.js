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
const multer_1 = __importDefault(require("multer"));
const validator_1 = __importDefault(require("validator"));
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const Auth_1 = require("./middleware/Auth");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// SIGNUP ENDPOINT //
app.post("/api/v1/signup", Auth_1.SignupInputVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  1. validating input using zod
    try {
        const username = (0, utils_1.capitalName)(req.body.username);
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
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdentity = req.body.userIdentity;
    const password = req.body.password;
    function validateUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // 2. check if the email exist
            try {
                console.log("checking email");
                console.log(query);
                const existUser = yield db_1.UserModal.findOne(query);
                console.log(existUser);
                if (existUser && existUser.password) {
                    console.log("found user now checking password");
                    // 3. check password 
                    const verifiedPass = yield bcrypt_1.default.compare(password, existUser.password);
                    //4. create jwt
                    if (verifiedPass) {
                        console.log("password is correct");
                        const token = jsonwebtoken_1.default.sign({ id: existUser._id }, config_1.JWT_SECRET);
                        res.status(200).json({ success: true, token });
                        return;
                    }
                    else {
                        console.log("password wasnt correct");
                        res.status(403).json({ success: false, errorType: "jwt", error: "username/email or password is wrong" });
                        return;
                    }
                }
                else {
                    res.status(403).json({ success: false, errorType: "jwt", error: "username/email or password is wrong" });
                }
            }
            catch (error) {
                console.log("-----------signin error -------------");
                console.log(error);
                res.status(400).json({ message: "error" });
                return;
            }
        });
    }
    if (validator_1.default.isEmail(userIdentity)) {
        validateUser({ email: userIdentity });
        console.log("this was email");
    }
    else {
        validateUser({ username: userIdentity });
        console.log("this is username");
    }
}));
// ADD-IMAGE ENDPOINT
app.put("/api/v1/upload-image", upload.single("profile"), Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        if (req.file) {
            const response = yield db_1.UserModal.updateOne({
                _id: userId
            }, {
                image: req.file.buffer
            });
            if (response) {
                console.log(response);
                res.status(200).json(response);
            }
            else {
                console.log("couldnt upload file");
                res.status(300);
            }
        }
    }
    catch (error) {
        console.log("error while uploading image");
        console.log(error);
        res.status(304).json(error);
    }
}));
// GET-USER-INFO (for sidebar)
app.get("/api/v1/user-info", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    try {
        const response = yield db_1.UserModal.findOne({ _id: userId }).select("username email image");
        if (response) {
            // res.set("Content-Type","image/png")
            res.status(200).json(response);
            // console.log(response)
        }
        else {
            res.status(401).json({ message: "please login again" });
            console.log("couldn't get response");
        }
    }
    catch (error) {
        res.status(404).json({ message: "please login again" });
        console.log(error);
    }
}));
// GET TAGS //
app.get("/api/v1/get-tags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield db_1.TagsModal.find();
        if (tags) {
            // console.log(tags)
            const tagsNames = tags.map((tag) => tag.name);
            res.status(200).json({ tags: tagsNames });
        }
        else {
            res.status(204);
            console.log(tags);
        }
    }
    catch (error) {
        res.status(404);
        console.log(error);
    }
}));
// ADD-CONTENT ENDPOINT //
app.post("/api/v1/add-content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.body.userId
    const { type, link, title, tags } = req.body.newContent;
    const userId = req.body.userId;
    // console.log(userId)
    // console.log(type)
    // console.log(link)
    // console.log(title)
    // console.log(tags) 
    try {
        const existingTags = yield db_1.TagsModal.find({ name: { $in: tags } });
        const existingTagsName = existingTags.map((tag) => tag.name);
        const existingTagIds = existingTags.map((tag) => tag._id);
        const newTags = tags.filter((tag) => !existingTagsName.includes(tag));
        const InsertNewTags = yield db_1.TagsModal.insertMany(newTags.map((tag) => ({ name: tag })));
        const newTagsId = InsertNewTags.map((tag) => tag._id);
        const tagIds = [...existingTagIds, ...newTagsId];
        // console.log(tagId)
        const newContent = yield db_1.ContentModal.create({
            type,
            link,
            title,
            userId,
            tags: tagIds,
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
// GET-PARTICULAR CONTENT ENDPOINT //
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
// GET ALL CONTENT OF USER //
app.get("/api/v1/content", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.body.userId;
    const type = req.query.type;
    try {
        let foundContents;
        if (type === "all") {
            foundContents = yield db_1.ContentModal.find({ userId }).populate({ path: 'userId', select: 'username' }).populate('tags', 'name');
        }
        else {
            foundContents = yield db_1.ContentModal.find({ userId, type }).populate({ path: 'userId', select: 'username' }).populate('tags', 'name');
        }
        if (foundContents.length == 0) {
            console.log(foundContents);
            // console.log("content not found")
            const user = yield db_1.UserModal.findOne({ _id: userId });
            if (user) {
                let username = user.username;
                res.status(200).json({ foundContents, username });
                // console.log("user exist but content doesnt")
            }
            else {
                // console.log("user doesnt exist")
                res.status(404);
            }
        }
        else {
            // console.log("foundcontent exist")
            // console.log(foundContents[0])
            let username = ((_a = foundContents[0]) === null || _a === void 0 ? void 0 : _a.userId).username;
            res.status(200).json({ foundContents, username });
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
        if (deleted)
            res.status(200).json({ success: true });
        else
            res.status(500);
        //expected ----------> { acknowledged: true, deletedCount: 1 }
    }
    catch (error) {
        // console.log("-----error--------")
        res.status(500).json({ success: false });
        console.log(error);
    }
}));
// GENERATE A SHAREABLE LINK //
app.post("/api/v1/content/share", Auth_1.verifyUserToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share, userId } = req.body;
    if (share) {
        try {
            const contentExist = yield db_1.ContentModal.find({ userId });
            if (contentExist.length == 0) {
                // console.log("content does not exist ")
                res.status(200).json({ success: false });
            }
            else {
                // console.log("content exist ")
                const linkExist = yield db_1.LinkModal.findOne({ userId });
                if (linkExist) {
                    console.log("link already exist ");
                    const shareableLink = `/${linkExist.hash}`;
                    res.status(200).json({ success: true, link: shareableLink });
                    return;
                }
                else {
                    // console.log("link created ")
                    const hash = (0, utils_1.random)(10);
                    const Link = yield db_1.LinkModal.create({
                        hash,
                        userId
                    });
                    if (Link) {
                        // console.log("link created succesfuly")
                        //created link
                        const shareableLink = `/${hash}`;
                        res.status(200).json({ success: true, link: shareableLink });
                    }
                    else {
                        // console.log("link not created")
                        //unexpected error occured while creating link
                        res.status(500).json({ success: false });
                    }
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
    const share = req.params.share.replace(":", "");
    // console.log(share)
    try {
        const Link = yield db_1.LinkModal.findOne({ hash: share });
        if (Link) {
            const userId = Link.userId;
            if (userId) {
                const content = yield db_1.ContentModal.find({ userId }).populate('userId', 'username').populate('tags', 'name');
                if (content) {
                    const username = content[0].userId.username;
                    res.status(200).json({ content, username });
                    // console.log(content)
                    return;
                }
                else {
                    const user = yield db_1.UserModal.findOne({ _id: userId });
                    //no content 204
                    if (user) {
                        res.status(200).json({ content, username: user.username });
                        // console.log("user exist but content doesnt")
                    }
                    else {
                        // console.log("user doesnt exist")
                        res.status(404);
                    }
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
const server = app.listen(3000, () => {
    console.log("listening");
});
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
