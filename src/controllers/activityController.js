const { StatusCodes } = require('http-status-codes')
import activityService from '~/services/activityService'

const create = async (req, res, next) => {
  try {
    const result = await activityService.create(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getAll = async (req, res, next) => {
  try {
    const result = await activityService.getAll()
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  create,
  getAll
}
