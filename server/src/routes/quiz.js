const router = require("express").Router();
const quizController = require("../controller/quizController");

router.post("/", quizController.submitQuiz);
router.post("/analyze", quizController.analyzeQuiz);

module.exports = router;
