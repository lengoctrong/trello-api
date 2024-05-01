import cardModel from '~/models/cardModel'
import columnModel from '~/models/columnModel'
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

export default {
  create
}
