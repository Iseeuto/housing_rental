import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getHousings(req, res) {
  const housings = await prisma.housing.findMany({
    include: {
      landlord: true,
      bookings: true,
    },
  });

  res.json(housings);
}

export async function getHousingByID(req, res) {
  res.json(req.housing);
}

export async function addHousing(req, res) {
  const { landlordId, name, city, pricePerDay, capacity } = req.body;

  const housing = await prisma.housing.create({
    data: {
      landlordId,
      name,
      city,
      pricePerDay,
      capacity,
    },
  });

  res.status(201).json(housing);
}

export async function updateHousing(req, res) {
  const { id } = req.params;
  const { landlordId, name, city, pricePerDay, capacity } = req.body;

  const housing = await prisma.housing.update({
    where: { id },
    data: {
      landlordId,
      name,
      city,
      pricePerDay,
      capacity,
    },
  });

  res.json(housing);
}

export async function deleteHousing(req, res) {
  const { id } = req.params;

  await prisma.housing.delete({
    where: { id },
  });

  // Delete the bookings related to the housing
  await prisma.booking.deleteMany({
    where: { housingId: id },
  });

  res.sendStatus(200);
}

export async function getHousingBookings(req, res) {
  const { id } = req.params;

  const bookings = await prisma.booking.findMany({
    where: {
      housingId: id,
    },
    select: {
      arrivalDate: true,
      departureDate: true,
      tenant: {
        select: {
          name: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  res.status(200).json(bookings);
}
