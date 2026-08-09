import app from "./src/app.js";
import dns from "dns";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

connectDB()

app.listen(config.PORT,()=>{
    console.log(`server is running on port ${config.PORT}`)
})
