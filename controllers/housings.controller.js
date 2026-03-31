import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getHousings(req, res) {
  const housings = await prisma.housing.findMany({
    where: req.filter,
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

export async function getHousingReservations(req, res) {
  const { id } = req.params;

  const reservations = await prisma.booking.findMany({
    where: { housingId: id },
    include: {
      tenant: true,
      housing: true,
    },
  });

  res.json(reservations);
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

  res.sendStatus(200);
}
