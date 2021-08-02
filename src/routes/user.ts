import express from "express";
import {Router} from "express";
import UserController from "../controllers/userController"
import auth from "../middlewares/auth";

var router : Router = express.Router();

router.post("/",UserController.createUser);
router.get("/me",auth,UserController.myInfo);

export default router;