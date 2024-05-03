import Joi from 'joi'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  extractData
} from '~/utils/validators'

const collectionName = 'columns'

const collectionSchema = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().trim().strict(),

  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

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
        boardId: new ObjectId(validDoc.boardId)
      })
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (columnId, updatedData) => {
  try {
    extractData(updatedData, invalidFields)

    // convert id to ObjectId
    if (updatedData.cardOrderIds) {
      updatedData.cardOrderIds = updatedData.cardOrderIds.map(
        (cardId) => new ObjectId(cardId)
      )
    }

    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(columnId)
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

const pushCardOrderIds = async (card) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(card.columnId)
        },
        {
          $push: {
            cardOrderIds: new ObjectId(card._id)
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
  create,
  update,
  findOneById,
  deleteOneById,
  pushCardOrderIds
}
