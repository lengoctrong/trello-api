const { StatusCodes } = require('http-status-codes')
import boardService from '~/services/boardService'

const create = async (req, res, next) => {
  try {
    const result = await boardService.create(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const result = await boardService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await boardService.update(req.params.id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const moveCardOtherColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardOtherColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  create,
  update,
  getDetails,
  moveCardOtherColumn
}
