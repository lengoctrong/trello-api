import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const create = async (req, res, next) => {
  const schema = Joi.object({
    boardId: Joi.string().required(),
    content: Joi.string().required(),
    createdAt: Joi.date().timestamp('javascript').required()
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

export default {
  create
}
