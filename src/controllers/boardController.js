const { StatusCodes } = require('http-status-codes')

const create = async (req, res, next) => {
  try {
    // next()
    res.status(StatusCodes.CREATED).json({ message: '[POST] board' })
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ errors: new Error(err).message })
  }
}

export default {
  create
}
