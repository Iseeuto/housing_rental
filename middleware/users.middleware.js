import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError } from "./common.js";

const prisma = new PrismaClient();

export function validateUserFields(req, res, next) {
  const { name, lastName, email, phone } = req.body;
  const errors = [];

  if (!name) errors.push("name");
  if (!lastName) errors.push("lastName");
  if (!email) errors.push("email");
  if (!phone) errors.push("phone");

  if (errors.length > 0)
    throw BuildError(400, `Missing required fields: ${errors.join(", ")}`);

  next();
}

export function validateEmail(req, res, next) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const { email } = req.body.email;

  if (!regex.test(email))
    throw BuildError(400, "Bad email format. (mail@example.com)");

  next();
}

export function validatePhone(req, res, next) {
  const regex = /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/;
  const { phone } = req.body.phone;

  if (!regex.test(phone))
    throw BuildError(400, "Bad phone format. (XX-XX-XX-XX-XX)");

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
