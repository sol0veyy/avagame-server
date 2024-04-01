const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/settings', userController.settings);
router.get('/auth', authMiddleware, userController.check);
router.get('/update:userId', userController.update);
router.get('/all', userController.getAllUsers);
router.get('/allByFilter/:findText', userController.getAllByFilter);
router.get('/:login', userController.getUserByLogin);

module.exports = router