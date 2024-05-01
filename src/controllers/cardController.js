const { StatusCodes } = require('http-status-codes')
import cardService from '~/services/cardService'

const create = async (req, res, next) => {
  try {
    const result = await cardService.create(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  create
}
