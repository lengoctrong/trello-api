import Joi from 'joi'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  extractData
} from '~/utils/validators'
import cardModel from './cardModel'
import columnModel from './columnModel'

const collectionName = 'boards'

const collectionSchema = Joi.object({
  title: Joi.string().trim().strict(),
  slug: Joi.string().trim().strict(),
  description: Joi.string().min(3).max(256).trim().strict(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  columns: Joi.array().items(Joi.object()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const invalidFields = ['_id', 'createdAt']

const validate = async (data) => {
  try {
    return await collectionSchema.validateAsync(data, {
      abortEarly: false
    })
  } catch (err) {
    throw new Error(err)
  }
}

const create = async (doc) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .insertOne(await validate(doc))
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

const update = async (boardId, updatedData) => {
  try {
    extractData(updatedData, invalidFields)

    if (updatedData.columnOrderIds) {
      updatedData.columnOrderIds = updatedData.columnOrderIds.map(
        (columnId) => new ObjectId(columnId)
      )
    }

    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(boardId)
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

const deleteOneById = async (id) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .deleteOne({ _id: ObjectId.isValid(id) ? new ObjectId(id) : id })
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

const getDetails = async (id) => {
  try {
    const [result] = await db
      .get()
      .collection(collectionName)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id)
            // _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.collectionName,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.collectionName,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()
    return result || null
  } catch (err) {
    throw new Error(err)
  }
}

const pushColumnOrderIds = async (column) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId)
        },
        {
          $push: {
            columnOrderIds: new ObjectId(column._id)
          }
        },
        {
          returnDocument: 'after'
        }
      )
  } catch (err) {
    throw new Error(err)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId)
        },
        {
          $pull: {
            columnOrderIds: new ObjectId(column._id)
          }
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
  collectionName,
  collectionSchema,
  getAll,
  create,
  update,
  deleteOneById,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  pullColumnOrderIds
}
