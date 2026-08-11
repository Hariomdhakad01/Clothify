import app from "./src/app.js";
import dns from "dns";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/db.js";

try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (error) {
    console.warn("Failed to set DNS servers, using default:", error.message);
}

connectDB()

app.listen(config.PORT,()=>{
    console.log(`server is running on port ${config.PORT}`)
})
