import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const create = async (req, res, next) => {
  const schema = Joi.object({
    _id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().trim().strict(),

    cards: Joi.array().items(Joi.object()),
    cardOrderIds: Joi.array().items(
      Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .strict()
    )
  })

  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (err) {
    const customErr = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      err.message
    )
    next(customErr)
  }
}

const update = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .strict()
    )
  })
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (err) {
    const customErr = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      err.message
    )
    next(customErr)
  }
}

const deleteItem = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await schema.validateAsync(req.params)
    next()
  } catch (err) {
    const customErr = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      err.message
    )
    next(customErr)
  }
}

export default {
  create,
  update,
  deleteItem
}
