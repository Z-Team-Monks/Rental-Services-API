import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/error";
require("express-async-errors");

//routes
import Routes from "./routes/index";

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
app.use("/api/v1/users", Routes.userRoute);
app.use("/api/v1/auth", Routes.authRoute);
app.use("/api/v1/property/",Routes.propertyRoute);
app.use("/api/v1/admin/",Routes.adminRoute);


//lines below serve files inside uploads directory and make them accessible through http://localhost:port/filename
app.use(express.static(__dirname + '/public'));
app.use(express.static('uploads'));
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log("Server is running... at port " + process.env.PORT);
});