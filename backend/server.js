require("dotenv").config({ path: "./users.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/profileRoutes"));


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend chạy http://localhost:${PORT}`));
