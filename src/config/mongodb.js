import { MongoClient, ServerApiVersion } from 'mongodb'
import env from './environment'

const mongoClient = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let client = null

const connect = async () => {
  await mongoClient.connect()
  client = mongoClient.db(env.DATABASE_NAME)
}

const get = () => {
  if (!client) return
  return client
}

const close = async () => {
  await client.close()
}

export default {
  connect,
  get,
  close
}
