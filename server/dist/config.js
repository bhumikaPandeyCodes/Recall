"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALT_ROUNDS = exports.JWT_SECRET = exports.MONGO_URI = exports.PORT = void 0;
require("dotenv/config");
exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
exports.MONGO_URI = process.env.MONGO_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
