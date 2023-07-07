const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("timeline");
});


module.exports = router;