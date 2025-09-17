const router = require("express").Router();
const careerController = require("../controller/careerController");

router.post("/analysis", careerController.analyzeCareer);
router.post("/chat", careerController.chat);

module.exports = router;
