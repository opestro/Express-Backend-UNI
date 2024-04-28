const express = require('express');
const router = express.Router();
const helpController = require('../controllers/help');

// Route to accept help request
router.post('/help', helpController.acceptHelp);

module.exports = router;
