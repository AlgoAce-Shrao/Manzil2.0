const router = require("express").Router();
const quizController = require("../controller/quizController");

router.post("/", quizController.submitQuiz);

module.exports = router;
