import boardModel from '~/models/boardModel'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'

const create = async (data) => {
  try {
    const column = {
      ...data
    }
    const doc = await columnModel.create(column)
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

const deleteItem = async (columnId) => {
  try {
    await columnModel.deleteOneById(columnId)
    await cardModel.deleteManyByColumnId(columnId)
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
