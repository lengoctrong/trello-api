const { StatusCodes } = require('http-status-codes')
import columnService from '~/services/columnService'

const create = async (req, res, next) => {
  try {
    const result = await columnService.create(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await columnService.update(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const result = await columnService.deleteItem(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const result = await columnService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  create,
  update,
  deleteItem,
  getDetails
}
