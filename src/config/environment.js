import 'dotenv/config'

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_HOST: process.env.LOCAL_HOST,
  LOCAL_PORT: process.env.LOCAL_PORT
}
