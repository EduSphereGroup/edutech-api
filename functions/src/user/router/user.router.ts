import express from "express";
import { userController } from "../controller/user.controller";
import { authenticate } from "../../middleware/authMiddleware";

const router = express.Router();

//router.get("/", authenticate, userController.get);
router.get("/stats", authenticate, userController.getStats);

router.get("/progress", authenticate, userController.getProgress);
router.post("/progress/complete", authenticate, userController.completeLesson);

router.get("/badges", authenticate, userController.getBadges);

router.get("/modules", authenticate, userController.getModules);
router.get("/modules/:id", authenticate, userController.getModuleById);

router.get("/preferences", authenticate, userController.getPreferences);
router.post("/preferences", authenticate, userController.savePreferences);



export default router;
