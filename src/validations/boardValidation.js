import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
const create = async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict()
    // description: Joi.string().required().min(3).max(256).trim().strict()
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (err) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: new Error(err).message })
  }
}

export default {
  create
}
