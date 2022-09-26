import mongoose from "mongoose";
import config from "./config";

const connect = () => {
    mongoose.connect(
        config.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAlive: true,
        },
        (err) => {
            if (err) {
                console.log(`ERROR DB: ${err}`);
            } else {
                console.log(`correct connection established`)
            }
        }
    )
}
connect();

