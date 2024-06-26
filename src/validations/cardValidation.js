import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const create = async (req, res, next) => {
  const schema = Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().trim().strict(),
    description: Joi.string().allow(''),
    type: Joi.string().valid('getCardsByColumnId')
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
    description: Joi.string().allow(''),
    taskTimer: Joi.object({
      startDate: Joi.string().allow(null),
      endDate: Joi.string().allow(null),
      status: Joi.string().allow(null)
    }).allow(null)
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

const updateAllCardsColumnId = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().strict(),
    columnId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .strict()
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

export default {
  create,
  update,
  updateAllCardsColumnId
}
