import { check } from "express-validator";
import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError, validateFields } from "./common.js";

const prisma = new PrismaClient();

const rules = [
  check("landlordId")
    .notEmpty()
    .withMessage("'landlordId' field is missing.")
    .bail()
    .isString()
    .withMessage("'landlordId' should be a string."),

  check("name")
    .notEmpty()
    .withMessage("'name' field is missing.")
    .bail()
    .isString()
    .withMessage("'name' should be a string."),

  check("city")
    .notEmpty()
    .withMessage("'city' field is missing.")
    .bail()
    .isString()
    .withMessage("'city' should be a string."),

  check("pricePerDay")
    .notEmpty()
    .withMessage("'pricePerDay' field is missing.")
    .bail()
    .isFloat()
    .withMessage("'pricePerDay' should be a float."),

  check("capacity")
    .notEmpty()
    .withMessage("'capacity' field is missing.")
    .bail()
    .isInt()
    .withMessage("'capacity' should be an int."),
];

export async function validateHousingFields(req, res, next) {
  validateFields(rules, req, res);

  if (req.body.pricePerDay <= 0)
    throw BuildError(400, "'pricePerDay' should be non-null positive.");
  if (req.body.capacity <= 0)
    throw BuildError(400, "'capacity' should be non-null positive.");

  next();
}

export function validateHousingId(req, res, next) {
  const { id } = req.params;

  if (!id) throw BuildError(400, "Housing ID is required.");

  next();
}

export async function checkHousingExists(req, res, next) {
  const { id } = req.params;

  const housing = await prisma.housing.findUnique({
    where: { id },
  });

  if (!housing) throw BuildError(404, "Housing not found.");

  req.housing = housing;

  next();
}
