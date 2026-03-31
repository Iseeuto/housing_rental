import express from "express";
import {
  getBookings,
  getBookingByID,
  addBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings.controller.js";

import {
  validateBookingFields,
  validateBookingId,
  checkBookingExists,
  validateBookingDates,
  checkBookingConflicts,
} from "../middleware/bookings.middleware.js";

const router = express.Router();

router.get("/", getBookings);

router.get("/:id", validateBookingId, checkBookingExists, getBookingByID);

router.post(
  "/",
  validateBookingFields,
  validateBookingDates,
  checkBookingConflicts,
  addBooking,
);

router.put(
  "/:id",
  validateBookingId,
  checkBookingExists,
  validateBookingFields,
  validateBookingDates,
  updateBooking,
);

router.delete(
  "/:id",
  validateBookingId,
  checkBookingExists,
  checkBookingConflicts,
  deleteBooking,
);

export default router;
