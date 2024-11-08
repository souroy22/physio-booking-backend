// packages imports
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "./configs/corsConfig";

// files
import router from "./routers";
import connectDB from "./db/dbConfig";
// import { corsOptions } from "./config/corsConfig";

const app = express();
const PORT: string = process.env.PORT || "8000";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user: Record<string, any>;
      token: string;
    }
  }
}

app.use(express.json({ limit: "10kb" }));
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hiiii Hello");
});
connectDB();
app.use("/api/v1", router);

app.listen(parseInt(PORT, 10), `0.0.0.0`, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
