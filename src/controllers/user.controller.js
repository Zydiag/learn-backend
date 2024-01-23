import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  // getting data from client
  const { username, email, password } = req.body
  // validations

  // The first method might be considered more explicit about checking for empty strings, while the second method is a more common pattern for checking truthiness.
  // if ([username, email, password].some((field) => field?.trim() === ''))
  if (!username || !email || !password) {
    throw new apiError(400, 'All fields are required')
  }
  // todo apply validation for email as well

  // check if user exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  })
  if (existedUser) throw new apiError(409, 'email or username already exists')

  // check for file uploaded
  let avatarLocalPath
  if ('avatar' in req.files) {
    avatarLocalPath = req.files?.avatar[0]?.path
  } else {
    throw new apiError(400, 'avatar is required')
  }
  const coverImageLocalPath =
    'coverImage' in req.files ? req.files?.coverImage[0]?.path : ''

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) throw new apiError(500, 'image upload failed')

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage?.url || '' : '',
    username: username.toLowerCase(),
  })
  // remove password & refreshtoken from response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  )

  if (!createdUser) throw new apiError(500, 'user not created')

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        createdUser,
        'User created Successfully. Now you can login'
      )
    )
})

export { registerUser }
