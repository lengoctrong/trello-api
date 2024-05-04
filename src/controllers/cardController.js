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

const getAll = async (req, res, next) => {
  try {
    const { columnId } = req.query
    const result = await cardService.getAll(columnId)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateAllCardsColumnId = async (req, res, next) => {
  try {
    const result = await cardService.updateAllCardsColumnId(
      req.params.id,
      req.body
    )
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export default {
  create,
  getAll,
  updateAllCardsColumnId
}
