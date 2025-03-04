import 'dotenv/config'
export const PORT = process.env.PORT? parseInt(process.env.PORT): 3000
export const MONGO_URI = process.env.MONGO_URI as string
export const JWT_SECRET = process.env.JWT_SECRET as string
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10): 10