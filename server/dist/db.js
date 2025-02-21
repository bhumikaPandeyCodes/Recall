"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModal = exports.ContentModal = exports.TagsModal = exports.UserModal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
mongoose_1.default.connect(config_1.MONGO_URI);
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
});
const TagsSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true }
});
const ContentSchema = new mongoose_1.default.Schema({
    type: { type: String },
    link: String,
    title: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'tags' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'users' }
});
const LinkSchema = new mongoose_1.default.Schema({
    hash: { type: String },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'users', unique: true }
});
exports.UserModal = mongoose_1.default.model("users", UserSchema);
exports.TagsModal = mongoose_1.default.model("tags", TagsSchema);
exports.ContentModal = mongoose_1.default.model("content", ContentSchema);
exports.LinkModal = mongoose_1.default.model("link", LinkSchema);
