const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/log", (req, res) => {
    console.log("Test Case Result Received:", req.body.message);
    res.sendStatus(200);
});

app.listen(5000, () => console.log(" Log server running on http://localhost:5000"));
