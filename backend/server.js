const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db")
dotenv.config();
connectDB() //use to connect DB 

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());

const uploadRoute = require("./routes/uploadRoute")
const searchRoute = require("./routes/searchRoute")
const authRoutes = require("./routes/authRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const fileRoutes = require("./routes/fileRoutes")
const fileMonitorRoutes = require("./routes/fileMonitorRoutes")
const chatbotRoutes = require("./routes/chatbotRoute")
const usersRoutes = require("./routes/usersRoute")
const { startFileMonitoring } = require("./services/fileMonitorService")

app.use("/api/upload", uploadRoute)
app.use("/api/search", searchRoute)
app.use("/api/auth", authRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/monitor", fileMonitorRoutes)
app.use("/api/chatbot", chatbotRoutes)
app.use("/api/users", usersRoutes)

// Start file monitoring on server startup
startFileMonitoring();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
