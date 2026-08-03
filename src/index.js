import dns from "dns";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env",
});


dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB()