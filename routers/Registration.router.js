import express from "express";
const router = express.Router();
import {
  registerUser,
  logins,
  bookingForm,
} from "../controller/Controller.registration.js";

// Create Registration
router.post("/create", registerUser);
router.post("/login", logins);
router.post("/bookings", bookingForm);

export default router;
