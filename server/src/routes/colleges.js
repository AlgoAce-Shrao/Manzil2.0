const router = require("express").Router();
const collegeController = require("../controller/collegesController");

router.get("/nearby", collegeController.getNearby);

module.exports = router;
