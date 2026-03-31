import express from "express";

import {
  getUsers,
  getUserByID,
  addUser,
  updateUser,
  deleteUser,
  getUserBookings,
} from "../controllers/users.controller.js";

import {
  validateUserFields,
  validateUserId,
  checkUserExists,
  validateEmail,
  validatePhone,
} from "../middleware/users.middleware.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", validateUserId, checkUserExists, getUserByID);

router.get("/:id/bookings", validateUserId, checkUserExists, getUserBookings);

router.post("/", validateUserFields, validateEmail, validatePhone, addUser);

router.put(
  "/:id",
  validateUserId,
  checkUserExists,
  validateUserFields,
  validateEmail,
  validatePhone,
  updateUser,
);

router.delete("/:id", validateUserId, checkUserExists, deleteUser);

export default router;
