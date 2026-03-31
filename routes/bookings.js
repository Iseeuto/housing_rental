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

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", getBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Booking found
 */
router.get("/:id", validateBookingId, checkBookingExists, getBookingByID);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [housingId, tenantId, arrivalDate, departureDate]
 *             properties:
 *               housingId:
 *                 type: string
 *               tenantId:
 *                 type: string
 *               arrivalDate:
 *                 type: string
 *                 format: date-time
 *               departureDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post(
  "/",
  validateBookingFields,
  validateBookingDates,
  checkBookingConflicts,
  addBooking,
);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               arrivalDate:
 *                 type: string
 *                 format: date-time
 *               departureDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put(
  "/:id",
  validateBookingId,
  checkBookingExists,
  validateBookingFields,
  validateBookingDates,
  updateBooking,
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Booking deleted
 */
router.delete(
  "/:id",
  validateBookingId,
  checkBookingExists,
  checkBookingConflicts,
  deleteBooking,
);

export default router;
