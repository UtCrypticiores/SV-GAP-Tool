const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3001;

// Routes
const mapRoute = require("./routes/map.js");
const outageRoute = require("./routes/outage.js");
const timelineRoute = require("./routes/timeline.js");
const uploadRoute = require("./routes/upload.js");
const vehicleRoute = require("./routes/vehicleSettings.js");

// Middleware Routes
app.use("/", uploadRoute);
app.use("/map", mapRoute);
app.use("/outage", outageRoute);
app.use("/timeline", timelineRoute);
app.use("/vehicleSettings", vehicleRoute);

// Use ejs

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
	if (process.platform === 'win32') {
		import("open").then((open) => {
			open.default(`http://localhost:${PORT}`);
		});
	}
});
