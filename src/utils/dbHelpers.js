import { ObjectId } from 'mongodb'

export const generateNewObjectId = () => {
  return new ObjectId()
}
