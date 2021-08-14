import express ,{Router} from "express";
import PropertyController from "../controllers/propertyController"
import auth from "../middlewares/auth";
import upload from "../middlewares/uploads";

var router : Router = express.Router();

router.get("/",PropertyController.getProperties)
router.post("/",auth,upload.array('images',10),PropertyController.addProperty);
router.get("/:id",PropertyController.getProperty);
router.put("/:id",auth,PropertyController.updateProperty);
router.post("/:id/review",auth,PropertyController.reviewProperty);
router.post("/:id/like",auth,PropertyController.likeProperty);

export default router;