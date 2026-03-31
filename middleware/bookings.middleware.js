import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError } from "./common.js";

const prisma = new PrismaClient();

export function validateBookingFields(req, res, next) {
  const { tenantId, housingId, arrivalDate, departureDate } = req.body;
  const errors = [];

  if (!tenantId) errors.push("tenantId");
  if (!housingId) errors.push("housingId");
  if (!arrivalDate) errors.push("arrivalDate");
  if (!departureDate) errors.push("departureDate");

  if (errors.length > 0)
    throw BuildError(400, `Missing required fields: ${errors.join(", ")}`);

  next();
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

  if (isNaN(arrival) || isNaN(departure))
    throw BuildError(400, "Invalid date format.");

  if (arrival >= departure)
    throw BuildError(400, "Departure date must be after arrival date.");

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
