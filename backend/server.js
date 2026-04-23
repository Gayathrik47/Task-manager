const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

//  TEMP: direct MongoDB connection (so it works now)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Server working ");
});

// routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});