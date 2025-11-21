const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');

router.post('/send', emailController.send.bind(emailController));
router.post('/preview', emailController.preview.bind(emailController));
router.post('/validate', emailController.validate.bind(emailController));

module.exports = router;