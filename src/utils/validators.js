export const EMAIL_RULE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const EMAIL_RULE_MESSAGE =
  'Your string fails to match the Email pattern!'

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/

export const OBJECT_ID_RULE_MESSAGE =
  'Your string fails to match the Object Id pattern!'

export const extractData = (data, invalidFields) => {
  // remove invalid fields
  Object.keys(data).forEach((fieldName) => {
    if (invalidFields.includes(fieldName)) {
      delete data[fieldName]
    }
  })
}
