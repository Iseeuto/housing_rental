import express from "express";

import {
  getHousings,
  getHousingByID,
  addHousing,
  updateHousing,
  deleteHousing,
  getHousingReservations,
} from "../controllers/housings.controller.js";

import {
  validateHousingFields,
  validateHousingId,
  checkHousingExists,
  handleCityFilter,
} from "../middleware/housings.middleware.js";

const router = express.Router();

router.get("/", handleCityFilter, getHousings);

router.get("/:id", validateHousingId, checkHousingExists, getHousingByID);

router.get(
  "/:id/reservations",
  validateHousingId,
  checkHousingExists,
  getHousingReservations,
);

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
