import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRouters from "./routers/Registration.router.js";
import connectDB from "./database/Database.js";
// import bodyParser from "body-parser";

const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
// app.use(bodyParser.json({ limit: "10mb" }));
app.use("/api/users", UserRouters);

connectDB();

app.listen(port, () => {
  console.log("App is listening", port);
});
