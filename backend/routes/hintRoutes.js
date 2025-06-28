const express = require("express");
const { getHintsFromGemini, getTestHints } = require("../controllers/hintController");
const router = express.Router();

router.post("/", getHintsFromGemini);
router.post("/test", getTestHints);

module.exports = router;