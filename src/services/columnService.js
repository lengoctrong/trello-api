import { StatusCodes } from 'http-status-codes'
import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const create = async (data) => {
  try {
    const storeType = data.type ?? 'create'
    delete data.type
    const column = {
      ...data
    }
    const doc = await columnModel.create(column)
    const returnedColumn = await columnModel.findOneById(doc.insertedId)

    if (storeType === 'copy') {
      const cards = await cardModel.findManyByColumnId(returnedColumn._id)
      const newCards = {
        ...cards,
        columnId: returnedColumn._id
      }
      await columnModel.update(returnedColumn._id, {
        newCards,
        cardOrderIds: cards.map((card) => card._id),
        updatedAt: Date.now()
      })
    }

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
  deleteItem
}
