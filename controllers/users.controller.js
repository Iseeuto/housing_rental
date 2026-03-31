import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getUsers(_, res) {
  const users = await prisma.user.findMany({
    include: {
      housings: true,
      bookings: true,
    },
  });

  res.json(users);
}

export async function getUserByID(req, res) {
  res.json(req.user);
}

export async function addUser(req, res) {
  const { name, lastName, email, phone } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      phone,
    },
  });

  res.status(201).json(user);
}

export async function updateUser(req, res) {
  const id = req.params.id;
  const { name, lastName, email, phone } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      lastName,
      email,
      phone,
    },
  });

  res.status(200).json(user);
}

export async function deleteUser(req, res) {
  const id = req.params.id;

  await prisma.user.delete({
    where: { id },
  });

  res.sendStatus(200);
}

export async function getUserBookings(req, res) {
  const { id } = req.params.id;

  const bookings = await prisma.booking.findMany({
    where: {
      tenantId: id,
    },
    include: {
      housing: {
        select: {
          name: true,
          city: true,
          pricePerDay: true,
          capacity: true,
          landlord: {
            select: {
              name: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json(bookings);
}

export async function getUserHousings(req, res) {
  const { id } = req.params.id;

  const housings = await prisma.housing.findMany({
    where: {
      landlordId: id,
    },
    select: {
      name: true,
      city: true,
      pricePerDay: true,
      capacity: true,
    },
  });

  res.status(200).json(housings);
}
