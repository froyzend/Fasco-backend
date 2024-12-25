const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json());

/* Маршруты */
app.use("/users", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
