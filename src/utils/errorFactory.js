export default function errorFactory (code, message) {
  let error = new Error(message)
  error.code = code
  return error
}
