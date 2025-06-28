const express = require("express");
const { getHintsFromGemini } = require("../controllers/hintController");
const router = express.Router();

router.post("/", getHintsFromGemini);

module.exports = router;