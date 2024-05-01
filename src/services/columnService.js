import boardModel from '~/models/boardModel'
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

export default {
  create
}
