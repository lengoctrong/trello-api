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

const update = async (cardId, data) => {
  try {
    const updatedData = {
      ...data,
      updatedAt: Date.now()
    }
    return await cardModel.update(cardId, updatedData)
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

    await cardModel.updateManyByColumnId(columnId, updatedData)
  } catch (err) {
    throw err
  }
}

const getAllByColumnId = async (columnId) => {
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

const getAllByBoardId = async (boardId) => {
  try {
    const result = await cardModel.findManyByBoardId(boardId)
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
  update,
  updateAllCardsColumnId,
  getAllByColumnId,
  getAllByBoardId
}
