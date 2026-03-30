import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser"; 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/log", (req, res) => {
    const { message } = req.body;
    console.log(`[LOG] ${message}`);
    res.status(200).send("Logged to terminal");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
