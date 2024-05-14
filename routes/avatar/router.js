const Router = require('express')
const router = new Router()
const avatarController = require('../../controllers/avatar/controller')

router.get('/', avatarController.getAll);
router.post('/', avatarController.create);
router.post('/del', avatarController.delAvatar)
router.post('/like', avatarController.setLikes);
router.post('/like/del', avatarController.delLike);
router.get('/like/:avatarId/:userId', avatarController.getLike)
router.get('/user/:userId', avatarController.getUserAvatars);
router.get('/tag/:tag', avatarController.getByTag);

module.exports = router;