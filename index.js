import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {  userRouter,} from "./routes/index.js";
// import nodemailer from "nodemailer";

const app = express();
app.use(express.json());
dotenv.config();

app.get('/hw', (req, res) => {
  res.send('Hello World!')
})

// MIDDLE WARES

app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(bodyParser.json()); // for parsing application/json
app.use(cors());

app.use("/user", userRouter);

// Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.log(error);
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));