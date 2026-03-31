import express from "express";

import {
  getUsers,
  getUserByID,
  addUser,
  updateUser,
  deleteUser,
  getUserBookings,
  getUserHousings,
} from "../controllers/users.controller.js";

import {
  validateUserFields,
  validateUserId,
  checkUserExists,
} from "../middleware/users.middleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", validateUserId, checkUserExists, getUserByID);

router.get("/:id/bookings", validateUserId, checkUserExists, getUserBookings);

router.get("/:id/housings", validateUserId, checkUserExists, getUserHousings);

router.post("/", validateUserFields, addUser);

router.put(
  "/:id",
  validateUserId,
  checkUserExists,
  validateUserFields,
  updateUser,
);

router.delete("/:id", validateUserId, checkUserExists, deleteUser);

export default router;
