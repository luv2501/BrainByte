import dotenv from "dotenv";
dotenv.config();
console.log("ENV CHECK:", !!process.env.GITHUB_CLIENT_ID, !!process.env.GITHUB_CALLBACK_URL, process.cwd());

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`BrainByte server running on port ${PORT}`);
  });
});
