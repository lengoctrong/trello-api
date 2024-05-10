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
    if (req.query.columnId) {
      const result = await cardService.getAllByColumnId(req.query.columnId)
      res.status(StatusCodes.OK).json(result)
    }
    const result = await cardService.getAllByBoardId(req.query.boardId)
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await cardService.update(req.params.id, req.body)
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
  update,
  getAll,
  updateAllCardsColumnId
}
