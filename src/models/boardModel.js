import Joi from 'joi'
import _ from 'lodash'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import cardModel from './cardModel'
import columnModel from './columnModel'
const collectionName = 'boards'

const collectionSchema = Joi.object({
  title: Joi.string().trim().strict(),
  slug: Joi.string().trim().strict(),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  columns: Joi.array().items(Joi.object()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

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
            _id: new ObjectId(id),
            _destroy: false
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
    const result = await db
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

    return result.value
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  collectionName,
  collectionSchema,
  create,
  findOneById,
  getDetails,
  pushColumnOrderIds
}
