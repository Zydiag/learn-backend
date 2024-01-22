// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(err.code || 500).json({ success: false, message: error.message })
//   }
// }

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      return await Promise.resolve(requestHandler(req, res, next))
    } catch (err) {
      return next(err)
    }
  }
}

// asyncHandler.js

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next)
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message })
//   }
// }

// we're not using default export here
export { asyncHandler }
