import { configDotenv } from "dotenv"
export const MONGO_URI = process.env.MONGO_URI
export const JWT_SECRET = process.env.JWT_SECRET
export const SALT_ROUNDS = process.env.SALT_ROUNDS