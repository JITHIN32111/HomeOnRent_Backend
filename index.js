import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import authRotes from "./src/Routes/authRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import propertyRoutes from "./src/Routes/propertyRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://127.0.0.1:5173',],
//     methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     credentials: true
// }));
app.use(
  cors({
    origin: ["https://chatbot-s8ht.onrender.com"],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api/auth", authRotes);
app.use("/api/property", propertyRoutes);
app.use("/api/user", userRoutes);
