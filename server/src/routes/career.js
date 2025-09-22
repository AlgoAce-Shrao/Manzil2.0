const router = require("express").Router();
const careerController = require("../controller/careerController");

router.post("/analysis", careerController.analyzeCareer);
router.post("/trajectory", careerController.analyzeTrajectory);
router.post("/chat", careerController.chat);

module.exports = router;
