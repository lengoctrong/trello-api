import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'

const collectionName = 'activities'

const create = async (data) => {
  try {
    return await db.get().collection(collectionName).insertOne(data)
  } catch (err) {
    throw new Error(err)
  }
}

const getAll = async () => {
  try {
    return await db.get().collection(collectionName).find().toArray()
  } catch (err) {
    throw new Error(err)
  }
}

const findOneById = async (id) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .findOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id })
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  create,
  getAll,
  findOneById
}
