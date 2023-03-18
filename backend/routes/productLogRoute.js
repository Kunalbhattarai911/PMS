const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const createProductLog = require("../controllers/productLogController");

router.post("/logs", protect, createProductLog)

module.exports = router