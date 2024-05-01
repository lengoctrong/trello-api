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

const getDetails = async (id) => {
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
}

export default {
  create,
  getDetails
}
