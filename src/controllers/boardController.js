const { StatusCodes } = require('http-status-codes')

const create = async (req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json({ message: '[POST] board' })
  } catch (err) {
    next(err)
  }
}

export default {
  create
}
