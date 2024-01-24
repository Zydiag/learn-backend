import { Router } from 'express'
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessAndToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
)

router.route('/login').post(upload.none(), loginUser)

//secured routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessAndToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/current-user').get(verifyJWT, getCurrentUser)
router.route('/update-details').patch(verifyJWT, updateAccountDetails)

router
  .route('/avatar')
  .patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
router
  .route('/cover-image')
  .patch(verifyJWT, upload.single('avatar'), updateUserCoverImage)

router.route('/channel/:username').get(verifyJWT, getUserProfile)
router.route('/history/:username').get(verifyJWT, getUserWatchHistory)

export default router
