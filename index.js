import initApp from "./src/index.router.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
initApp(app,express);
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT} ....`);
})