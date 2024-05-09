import Joi from 'joi'
import { ObjectId } from 'mongodb'
import db from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, extractData } from '~/utils/validators'

const collectionName = 'users'

const collectionSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required().min(8),
  name: Joi.string(),
  avatar: Joi.string().default(
    'https://docs.material-tailwind.com/img/face-2.jpg'
  ),
  role: Joi.string().default('user'),
  isLogin: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const invalidFields = ['_id', 'role', 'createdAt']

const validate = async (data) => {
  try {
    return await collectionSchema.validateAsync(data, {
      abortEarly: false
    })
  } catch (err) {
    throw new Error(err)
  }
}

const create = async (userData) => {
  try {
    return await db
      .get()
      .collection(collectionName)
      .insertOne(await validate(userData))
  } catch (err) {
    throw new Error(err)
  }
}

const update = async (userId, updatedData) => {
  try {
    extractData(updatedData, invalidFields)

    return await db
      .get()
      .collection(collectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(userId)
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

const findUser = async (userData) => {
  try {
    return await db.get().collection(collectionName).findOne(userData)
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
  update,
  findOneById,
  findUser
}
