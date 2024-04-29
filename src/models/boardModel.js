import Joi from 'joi'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const collectionName = 'boards'

const collectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

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

export default {
  collectionName,
  collectionSchema,
  create,
  findOneById
}
