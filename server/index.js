const express = require('express');
const connectToMongo = require('./db');
const dotenv = require('dotenv').config();
const cors = require('cors');

connectToMongo();

const PORT = process.env.PORT;
const app = express();



app.use(express.json());
app.use(cors())


app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))


app.listen(PORT, () => {
    console.log(`server running at Port http://localhost:${PORT}`);
})