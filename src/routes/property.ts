import express ,{Router} from "express";
import PropertyController from "../controllers/propertyController"
import auth from "../middlewares/auth";
import upload from "../middlewares/uploads";

var router : Router = express.Router();

router.get("/",PropertyController.getProperties)
router.post("/",auth,PropertyController.addProperty);
router.get("/:id",PropertyController.getProperty);
router.put("/:id",auth,PropertyController.updateProperty);
router.post("/:id/reviewes",auth,PropertyController.reviewProperty);
router.post("/:id/likes",auth,PropertyController.likeProperty);

export default router;