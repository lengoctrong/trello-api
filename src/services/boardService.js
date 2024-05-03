import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const getAll = async () => {
  try {
    const result = await boardModel.getAll()
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Boards not found')
    }

    return result
  } catch (err) {
    throw err
  }
}

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

const moveCardOtherColumn = async (data) => {
  try {
    await columnModel.update(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(data.currentColumnId, {
      cardOrderIds: data.currentCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(data.currentCardId, {
      columnId: data.currentColumnId,
      updatedAt: Date.now()
    })

    return { updatedResult: 'Successfully' }
  } catch (err) {
    throw err
  }
}

export default {
  getAll,
  create,
  update,
  getDetails,
  moveCardOtherColumn
}
