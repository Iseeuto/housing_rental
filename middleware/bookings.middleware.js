import { check } from "express-validator";
import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError, validateFields } from "./common.js";

const prisma = new PrismaClient();

const rules = [
  check("tenantId")
    .notEmpty()
    .withMessage("'tenantId' field is missing.")
    .bail()
    .isString()
    .withMessage("'tenantId' should be a string."),

  check("housingId")
    .notEmpty()
    .withMessage("'housingId' field is missing.")
    .bail()
    .isString()
    .withMessage("'housingId' should be a string."),

  check("arrivalDate")
    .notEmpty()
    .withMessage("'arrivalDate' field is missing.")
    .bail()
    .isString()
    .withMessage("'arrivalDate' should be a string.")
    .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .withMessage("Expected date format is YYYY-MM-DD."),

  check("departureDate")
    .notEmpty()
    .withMessage("'departureDate' field is missing.")
    .bail()
    .isString()
    .withMessage("'departureDate' should be a string.")
    .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
    .withMessage("Expected date format is YYYY-MM-DD."),
];

export async function validateBookingFields(req, res, next) {
  validateFields(rules, req, res, next);
}

export function validateBookingId(req, res, next) {
  const { id } = req.params;

  if (!id) throw BuildError(400, "Booking ID is required.");

  next();
}

export async function checkBookingExists(req, res, next) {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) throw BuildError(404, "Booking not found.");

  req.booking = booking;

  next();
}

export function validateBookingDates(req, res, next) {
  const { arrivalDate, departureDate } = req.body;

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  if (arrival >= departure)
    throw BuildError(
      400,
      "Departure date must be strictly after arrival date.",
    );

  next();
}

export async function checkBookingConflicts(req, res, next) {
  const { housingId, arrivalDate, departureDate } = req.body;

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      housingId,
      AND: [
        {
          arrivalDate: {
            lt: departure,
          },
        },
        {
          departureDate: {
            gt: arrival,
          },
        },
      ],
    },
  });

  if (conflictingBooking)
    throw BuildError(
      409,
      "Booking dates conflict with an existing reservation.",
    );

  next();
}
