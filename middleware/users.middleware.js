import { check } from "express-validator";
import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError, validateFields } from "./common.js";

const prisma = new PrismaClient();

const rules = [
  check("name")
    .isEmpty()
    .withMessage("'name' field is missing.")
    .bail()
    .isString()
    .withMessage("'name' should be a string."),

  check("lastname")
    .isEmpty()
    .withMessage("'lastname' field is missing.")
    .bail()
    .isString()
    .withMessage("'lastname' should be a string."),

  check("email")
    .isEmpty()
    .withMessage("'email' field is missing.")
    .bail()
    .isString()
    .withMessage("'email' should be a string.")
    .isEmail()
    .withMessage("Bad email format. (mail@example.com)"),

  check("phone")
    .isEmpty()
    .withMessage("'phone' field is missing.")
    .bail()
    .isString()
    .withMessage("'phone' should be a string.")
    .matches(/^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/)
    .withMessage("Bad phone format. (XX-XX-XX-XX-XX)"),
];

export function validateUserFields(req, res, next) {
  validateFields(rules, req, res);
  next();
}

export function validateUserId(req, res, next) {
  const { id } = req.params;

  if (!id) throw BuildError(400, "User ID is required.");

  next();
}

export async function checkUserExists(req, res, next) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      housings: true,
      bookings: true,
    },
  });

  if (!user) throw BuildError(404, "User not found.");

  req.user = user;

  next();
}
