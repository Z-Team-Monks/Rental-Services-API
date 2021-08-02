import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

//routes
import users from "./routes/user";
import auth from "./routes/auth";

const app = express();
dotenv.config({ path: './.env' });

if (!process.env.jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/rentdb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,

  })
  .then(() => console.log('Connected to DB...'))
  .catch(err => console.error('Could not connect to DB...'));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);

app.listen(process.env.PORT, () => {
  console.log("Server is running... at port " + process.env.PORT);
});