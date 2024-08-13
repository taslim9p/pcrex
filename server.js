import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// configure env
dotenv.config();

const MONGO_URL = "mongodb://127.0.0.1:27017/pcrex";

// main().then(() => {
//   console.log("connected to mongoose");
// }).catch(err => {
//   console.log(err);
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database config
connectDB();
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'  // Replace with your frontend URL
}));

// Increase the payload size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// REST API
app.get("/", (req, res) => {
  res.send("<h1>Welcome to my app!</h1>");
});

// Port
const PORT = process.env.PORT || 8080;

// Listen app
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
