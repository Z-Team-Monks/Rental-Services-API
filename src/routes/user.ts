import express from "express";
import {Router} from "express";
import UserController from "../controllers/userController"
import auth from "../middlewares/auth";
import upload from "../middlewares/uploads";

var router : Router = express.Router();

router.post("/",UserController.createUser);
router.get("/me",auth,UserController.myInfo);
router.put("/profile",auth,upload.single('profile'),UserController.uploadPhoto);

export default router;