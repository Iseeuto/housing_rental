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

router.get("/", getHousings);

router.get("/:id", validateHousingId, checkHousingExists, getHousingByID);

router.get("/:id/bookings", validateHousingId, checkHousingExists, getHousingBookings)

router.post("/", validateHousingFields, addHousing);

router.put(
  "/:id",
  validateHousingId,
  checkHousingExists,
  validateHousingFields,
  updateHousing,
);

router.delete("/:id", validateHousingId, checkHousingExists, deleteHousing);

export default router;
