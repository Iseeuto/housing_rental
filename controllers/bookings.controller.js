import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getBookings(_, res) {
  const bookings = await prisma.booking.findMany({
    include: {
      housing: true,
      tenant: true,
    },
  });

  res.json(bookings);
}

export async function getBookingByID(req, res) {
  res.json(req.booking);
}

export async function addBooking(req, res) {
  const { tenantId, housingId, arrivalDate, departureDate } = req.body;
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  const booking = await prisma.booking.create({
    data: {
      tenantId,
      housingId,
      arrivalDate: arrival,
      departureDate: departure,
    },
  });

  res.status(201).json(booking);
}

export async function updateBooking(req, res) {
  const { id } = req.params;
  const { tenantId, housingId, arrivalDate, departureDate } = req.body;

  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      tenantId,
      housingId,
      arrivalDate: arrival,
      departureDate: departure,
    },
  });

  res.json(booking);
}

export async function deleteBooking(req, res) {
  const { id } = req.params;

  await prisma.booking.delete({
    where: { id },
  });

  res.sendStatus(200);
}
