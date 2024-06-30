import { Router } from "express";
import {
  registerUser,
  getUserSection,
  updateAccountDetails,
  getAllUsers,
} from "../controllers/user.controllers.js";


const router = Router();


router.route("/").get(getAllUsers);
router.route("/register").post(registerUser);
router.route("/update/:email").post(updateAccountDetails);
router.route("/section/:section").get(getUserSection);

//secured routed


export default router;
