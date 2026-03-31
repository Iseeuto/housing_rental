import { PrismaClient } from "../generated/prisma/index.js";
import { BuildError } from "./common.js";

const prisma = new PrismaClient();

export function validateHousingFields(req, res, next) {
  const { landlordId, name, city, pricePerDay, capacity } = req.body;
  const errors = [];

  if (!landlordId) errors.push("landlordId");
  if (!name) errors.push("name");
  if (!city) errors.push("city");
  if (pricePerDay === undefined) errors.push("pricePerDay");
  if (capacity === undefined) errors.push("capacity");

  if (errors.length > 0)
    throw BuildError(400, `Missing required fields: ${errors.join(", ")}`);

  if (pricePerDay <= 0) throw BuildError(400, "Price must be greater than 0.");

  if (capacity < 1) throw BuildError(400, "Capacity cannot be less than 1.");

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

export function handleCityFilter(req, res, next) {
  if (req.query.city) {
    req.filter = { city: req.query.city };
  } else {
    req.filter = {};
  }

  next();
}
