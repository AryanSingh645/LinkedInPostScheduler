import connectDB from "./db/index.js";
import { app } from "./app.js";

// dotenv.config({
//     path: './env'
// })

console.log(process.env.MONGODB_URI);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
})
