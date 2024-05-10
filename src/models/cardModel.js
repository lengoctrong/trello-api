import Joi from 'joi'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  extractData
} from '~/utils/validators'

const collectionName = 'cards'

const collectionSchema = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().trim().strict(),
  description: Joi.string().optional(),
  taskTimer: Joi.object({
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    status: Joi.string().allow(null)
  }).allow(null),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const invalidFields = ['_id', 'boardId', 'createdAt']

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
    const validDoc = await validate(doc)
    return await db
      .get()
      .collection(collectionName)
      .insertOne({
        ...validDoc,
        boardId: new ObjectId(validDoc.boardId),
        columnId: new ObjectId(validDoc.columnId)
      })
  } catch (err) {
    throw new Error(err)
  }
}

const createMany = async (docs) => {
  try {
    // validate each document in the docs array
    const validDocs = await Promise.all(docs.map((doc) => validate(doc)))

    // convert boardId and columnId to ObjectId
    const docsToInsert = validDocs.map((doc) => ({
      ...doc,
      boardId: new ObjectId(doc.boardId),
      columnId: new ObjectId(doc.columnId)
    }))

    return await db.get().collection(collectionName).insertMany(docsToInsert)
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (cardId, updatedData) => {
  try {
    extractData(updatedData, invalidFields)

    // convert id to ObjectId
    if (updatedData.columnId) {
      updatedData.columnId = new ObjectId(updatedData.columnId)
    }

    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(cardId)
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

const findManyByColumnId = async (columnId) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .find({
        columnId: ObjectId.isValid(columnId) ? new ObjectId(columnId) : columnId
      })
      .toArray()
  } catch (err) {
    throw new Error(err)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .deleteMany({
        columnId: ObjectId.isValid(columnId) ? new ObjectId(columnId) : columnId
      })
  } catch (err) {
    throw new Error(err)
  }
}

const updateManyByColumnId = async (columnId, updatedData) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .updateMany(
        {
          columnId: ObjectId.isValid(columnId)
            ? new ObjectId(columnId)
            : columnId
        },
        {
          $set: updatedData
        }
      )
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  collectionName,
  collectionSchema,
  create,
  createMany,
  update,
  findOneById,
  deleteManyByColumnId,
  findManyByColumnId,
  updateManyByColumnId
}
