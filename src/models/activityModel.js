import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'

const collectionName = 'activities'

const create = async (data) => {
  if (data.targetId || data.boardId) {
    data.boardId = ObjectId.isValid(data.boardId)
      ? new ObjectId(data.boardId)
      : data.boardId
    data.targetId = ObjectId.isValid(data.targetId)
      ? new ObjectId(data.targetId)
      : data.targetId
  }

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

const findOneByTargetIdAndUpdate = async (targetId, updatedData) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          targetId: new ObjectId(targetId)
        },
        {
          $set: updatedData
        },
        {
          returnDocument: 'after'
        }
      )
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  create,
  getAll,
  findOneById,
  findOneByTargetIdAndUpdate
}
