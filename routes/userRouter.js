import { Router } from "express";
const router = Router();
import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";
import {
  authenticateUser,
  authorizePermissions,
  checkForTestUser,
} from "../middleware/authMiddleware.js";
//upload image
import upload from "../middleware/multerMiddleware.js";

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  [authorizePermissions("admin"), authenticateUser],
  getApplicationStats
);
router.patch(
  "/update-user",
  checkForTestUser,
  upload.single("avatar"), //to upload image
  validateUpdateUserInput,
  updateUser
);
export default router;
