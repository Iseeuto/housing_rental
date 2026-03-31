import express from "express";

import {
  getHousings,
  getHousingByID,
  addHousing,
  updateHousing,
  deleteHousing,
  getHousingBookings,
} from "../controllers/housings.controller.js";

import {
  validateHousingFields,
  validateHousingId,
  checkHousingExists,
} from "../middleware/housings.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /housings:
 *   get:
 *     summary: Get all housings
 *     tags: [Housings]
 *     responses:
 *       200:
 *         description: List of housings
 */
router.get("/", getHousings);

/**
 * @swagger
 * /housings/{id}:
 *   get:
 *     summary: Get housing by ID
 *     tags: [Housings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Housing found
 */
router.get("/:id", validateHousingId, checkHousingExists, getHousingByID);

/**
 * @swagger
 * /housings/{id}/bookings:
 *   get:
 *     summary: Get bookings for a housing
 *     tags: [Housings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get(
  "/:id/bookings",
  validateHousingId,
  checkHousingExists,
  getHousingBookings,
);

/**
 * @swagger
 * /housings:
 *   post:
 *     summary: Create a housing
 *     tags: [Housings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [landlordId, name, city, pricePerDay, capacity]
 *             properties:
 *               landlordId:
 *                 type: string
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Housing created
 */
router.post("/", validateHousingFields, addHousing);

/**
 * @swagger
 * /housings/{id}:
 *   put:
 *     summary: Update a housing
 *     tags: [Housings]
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
 *               name:
 *                 type: string
 *               city:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Housing updated
 */
router.put(
  "/:id",
  validateHousingId,
  checkHousingExists,
  validateHousingFields,
  updateHousing,
);

/**
 * @swagger
 * /housings/{id}:
 *   delete:
 *     summary: Delete a housing
 *     tags: [Housings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Housing deleted
 */
router.delete("/:id", validateHousingId, checkHousingExists, deleteHousing);

export default router;
