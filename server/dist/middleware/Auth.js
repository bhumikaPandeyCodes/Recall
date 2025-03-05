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
exports.SignupInputVerify = SignupInputVerify;
exports.verifyUserToken = verifyUserToken;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const app = (0, express_1.default)();
function SignupInputVerify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requiredBody = zod_1.default.object({
                username: zod_1.default.string()
                    .min(5, { message: "username is too short" })
                    .max(15, "username cannot have more than 15 characters"),
                email: zod_1.default.string().email(),
                password: zod_1.default.string()
                    .min(6, { message: "password should have atleast 6 characters" })
                    .max(20, { message: "password cannot have more than 20 characters" })
                    .regex(/[A-Z]/, { message: "password must contain atleast one capital character" })
                    .regex(/[a-z]/, { message: "password must contain atleast one lowercase character" })
                    .regex(/[0-9]/, { message: "password must contain atleast one number" })
                    .regex(/[@$!%*?&#]/, { message: "password must contain atleast one special character" })
            });
            const validateBody = requiredBody.safeParse(req.body);
            console.log(validateBody);
            if (validateBody.success) {
                next();
            }
            else {
                res.status(400).json({ message: "invalid input | bad request", error: validateBody.error.issues[0].message });
                console.log(validateBody.error.issues[0].message);
            }
        }
        catch (error) {
            res.status(503).json({ message: "service unavailabe" });
        }
    });
}
// export function isEmail(userIdentity: string){
//     if(validator.isEmail(userIdentity))
//     return true
// }
function verifyUserToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (token) {
                const decodedData = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
                if (decodedData) {
                    req.body.userId = decodedData.id;
                    next();
                }
                else {
                    console.log("invalid token", decodedData);
                    res.send({ message: "Invalid token" });
                    return;
                }
            }
            else {
                // console.log("-------------token does not exist--------")
                res.status(400).send({ message: "token does not exist | not logged in" });
                return;
            }
        }
        catch (error) {
            console.log(error);
            res.json({ error });
            return;
        }
    });
}
