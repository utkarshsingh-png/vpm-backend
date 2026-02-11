const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

router.use(auth, roleCheck('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/visits', adminController.getAllVisits);
router.post('/users', adminController.createUser);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;