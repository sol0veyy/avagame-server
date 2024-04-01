const Router = require('express')
const router = new Router()
const avatarRouter = require('./avatarRouter')
const userRouter = require('./userRouter')
const followerRouter = require('./followerRouter')

router.use('/user', userRouter),
router.use('/follower', followerRouter)
router.use('/avatar', avatarRouter)

module.exports = router