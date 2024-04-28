const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/login", adminController.login);
router.put("/supplier/:id/accept", adminController.acceptSupplier);
router.put("/user/:id/accept", adminController.acceptUser);
router.put("/ban/user/:id", adminController.banUser);

module.exports = router;
