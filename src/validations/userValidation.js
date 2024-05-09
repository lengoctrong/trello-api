import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'

const create = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().min(8),
    type: Joi.string().valid('login', 'register').required()
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
    email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().min(8),
    name: Joi.string(),
    avatar: Joi.string(),
    address: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    isLogin: Joi.boolean()
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
  update
}
