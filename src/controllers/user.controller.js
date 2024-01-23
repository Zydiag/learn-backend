import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'

// * try using user instead of userId
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    const savedUser = await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new apiError(500, error.message)
  }
}

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
  // remove password & refreshToken from response
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

const loginUser = asyncHandler(async (req, res) => {
  // get login data from user
  const { email, username, password } = req.body
  if (!email && !username)
    throw new apiError(400, 'username or email is required')
  // note: my own way
  // handle login with email or username
  // let userExists
  // if (email) {
  //   userExists = User.findOne({ email })
  // } else if (username) {
  //   userExists = User.findOne({ username })
  // }

  const user = await User.findOne({ $or: [{ email }, { username }] })
  // check if user exists in db
  if (!user) throw new apiError(404, 'user not found')
  // if user exist match its password using bcrypt
  // [user] and [User] are not same
  //  user is our own created while User is mongodb model
  // so the user is an instance of User and the method created by us is available on this one
  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if (!isPasswordCorrect) throw new apiError(400, 'invalid credentials')
  // generate access and refresh token
  // console.log(user._id)

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  )
  // console.log(accessToken, refreshToken)
  // send access and refresh token via res/headers/cookies
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: user,
          accessToken,
          refreshToken,
        },
        'user logged in successfully'
      )
    )

  // send user data
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      // note try `new: false` as we are not using this instance
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'user logged out'))
})

const refreshAccessAndToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) throw new apiError(401, 'unauthorized access')

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) throw new apiError(401, 'Invalid refresh Token')

    if (incomingRefreshToken !== user.refreshToken)
      throw new apiError(401, 'refresh token expired or used')
    const options = {
      httpOnly: true,
      secure: true,
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    )
    return res
      .status(200)
      .cookies('accessToken', accessToken, options)
      .cookies('refreshToken', refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken },
          'access token updated successfully'
        )
      )
  } catch (error) {
    throw new apiError(401, error?.message || 'invalid refresh token')
  }
})

export { registerUser, loginUser, logoutUser, refreshAccessAndToken }
