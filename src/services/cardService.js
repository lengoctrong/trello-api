import { StatusCodes } from 'http-status-codes'
import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const create = async (data) => {
  try {
    const card = {
      ...data
    }

    const doc = await cardModel.create(card)
    const returnedCard = await cardModel.findOneById(doc.insertedId)

    if (returnedCard) {
      await columnModel.pushCardOrderIds(returnedCard)
    }

    return returnedCard
  } catch (err) {
    throw err
  }
}

const updateAllCardsColumnId = async (columnId, data) => {
  try {
    let updatedData = {
      ...data,
      updatedAt: Date.now()
    }

    const result = await cardModel.updateManyByColumnId(columnId, updatedData)

    console.log(`${result.modifiedCount} document(s) was/were updated.`)
  } catch (err) {
    throw err
  }
}

const getAll = async (columnId) => {
  try {
    const result = await cardModel.findManyByColumnId(columnId)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Cards not found')
    }

    return result
  } catch (err) {
    throw err
  }
}

export default {
  create,
  updateAllCardsColumnId,
  getAll
}
