import express from "express";
import {Router} from "express";
import AuthController from "../controllers/authController";

var router : Router = express.Router();

router.post("/",AuthController.getToken);
router.get("/isAdmin",AuthController.isAdmin);

export default router;