import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let mongoClient = null

const connect = async () => {
  await client.connect()
  mongoClient = client.db(env.DATABASE_NAME)
}

const get = () => {
  if (!mongoClient) return
  return mongoClient
}

const close = async () => {
  await mongoClient.close()
}

export const db = {
  connect,
  get,
  close
}
