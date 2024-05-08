import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const create = async (data) => {
  try {
    const clonedColumn = {
      ...data
    }

    // copy column with its cards
    if (clonedColumn.cards && clonedColumn.cardOrderIds) {
      const clonedCards = await cardModel.findManyByColumnId(clonedColumn._id)

      const column = {
        ...clonedColumn
      }
      delete column._id
      delete column.cards
      delete column.cardOrderIds

      const createdColumn = await columnModel.create(column)
      const returnedColumn = await columnModel.findOneById(
        createdColumn.insertedId
      )

      if (!returnedColumn)
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to create column'
        )

      const cards = clonedCards.map((card) => {
        delete card._id
        delete card.columnId
        delete card.updatedAt
        delete card.createdAt

        card.columnId = returnedColumn._id.toString()
        card.boardId = returnedColumn.boardId.toString()
        return card
      })

      await cardModel.createMany(cards)
      const returnedCards = await cardModel.findManyByColumnId(
        returnedColumn._id.toString()
      )

      const returnedCardOrderIds = returnedCards.map((card) =>
        card._id.toString()
      )

      await columnModel.update(returnedColumn._id.toString(), {
        cardOrderIds: returnedCardOrderIds
      })

      return {
        ...returnedColumn,
        cards: returnedCards,
        cardOrderIds: returnedCardOrderIds
      }
    }

    // create new column
    const doc = await columnModel.create(clonedColumn)
    const returnedColumn = await columnModel.findOneById(doc.insertedId)
    if (returnedColumn) {
      returnedColumn.cards = []
      await boardModel.pushColumnOrderIds(returnedColumn)
    }
    return returnedColumn
  } catch (err) {
    throw err
  }
}

const update = async (columnId, data) => {
  try {
    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }
    return await columnModel.update(columnId, updatedData)
  } catch (err) {
    throw err
  }
}

const getDetails = async (id) => {
  try {
    const result = await columnModel.findOneById(id)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    return result
  } catch (err) {
    throw err
  }
}

const deleteItem = async (columnId) => {
  try {
    const columnTarget = await columnModel.findOneById(columnId)
    if (!columnTarget) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    await columnModel.deleteOneById(columnId)
    await cardModel.deleteManyByColumnId(columnId)
    await boardModel.pullColumnOrderIds(columnTarget)
    return { deleteResult: 'Cột và tất cả các thẻ trong cột đã bị xóa' }
  } catch (err) {
    throw err
  }
}

export default {
  create,
  update,
  getDetails,
  deleteItem
}
