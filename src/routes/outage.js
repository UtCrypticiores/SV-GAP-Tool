const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("outage");
});
router.get("/api", (req, res) => {});

module.exports = router;
