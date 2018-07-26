const express = require('express');
const router = express.Router();
const userController = require('./user/controller');

// open routes
router.post('/register', userController.createUser);
router.post('/login', userController.authenticate);

// authorized routes
router.use(userController.verifyAccessToken);
router.get('/users', userController.getAllUsers);
router.post('/setBoss', userController.setBoss);

module.exports = router;
