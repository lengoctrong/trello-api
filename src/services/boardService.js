import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import boardModel from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const create = async (data) => {
  try {
    const board = {
      ...data,
      slug: slugify(data.title)
    }
    const doc = await boardModel.create(board)
    const returnedBoard = await boardModel.findOneById(doc.insertedId)

    return returnedBoard
  } catch (err) {
    throw err
  }
}

const update = async (boardId, data) => {
  try {
    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }
    return await boardModel.update(boardId, updatedData)
  } catch (err) {
    throw err
  }
}

const getDetails = async (id) => {
  try {
    const board = await boardModel.getDetails(id)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const returnedBoard = cloneDeep(board)
    returnedBoard.columns.forEach((column) => {
      column.cards = returnedBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      )
    })

    delete returnedBoard.cards

    return returnedBoard
  } catch (err) {
    throw err
  }
}

export default {
  create,
  update,
  getDetails
}
