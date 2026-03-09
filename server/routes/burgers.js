const express = require("express");
const store = require("../store/burgerStore");
const { createHttpError } = require("../lib/httpError");

const router = express.Router();

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw createHttpError(400, "INVALID_ID", "Burger id must be a positive integer.");
  }
  return id;
}

function parseBurgerName(payload) {
  const burgerName = payload?.burger_name;
  if (typeof burgerName !== "string") {
    throw createHttpError(400, "INVALID_BURGER_NAME", "burger_name is required.");
  }

  const trimmed = burgerName.trim();
  if (!trimmed) {
    throw createHttpError(400, "INVALID_BURGER_NAME", "burger_name cannot be empty.");
  }

  if (trimmed.length > 120) {
    throw createHttpError(400, "INVALID_BURGER_NAME", "burger_name cannot exceed 120 characters.");
  }

  return trimmed;
}

function listBurgers(_req, res) {
  res.json(store.list());
}

function createBurger(req, res, next) {
  try {
    const burgerName = parseBurgerName(req.body);
    const createdBurger = store.create(burgerName);
    res.status(201).json(createdBurger);
  } catch (error) {
    next(error);
  }
}

function devourBurger(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const desiredDevoured = req.body?.devoured;
    const devoured =
      typeof desiredDevoured === "undefined"
        ? true
        : typeof desiredDevoured === "boolean"
          ? desiredDevoured
          : null;

    if (devoured === null) {
      throw createHttpError(
        400,
        "INVALID_DEVOUR_FLAG",
        "devoured must be a boolean when provided."
      );
    }

    const updatedBurger = store.updateDevoured(id, devoured);
    if (!updatedBurger) {
      throw createHttpError(404, "BURGER_NOT_FOUND", "Burger not found.");
    }

    res.json(updatedBurger);
  } catch (error) {
    next(error);
  }
}

function deleteBurger(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const deleted = store.remove(id);
    if (!deleted) {
      throw createHttpError(404, "BURGER_NOT_FOUND", "Burger not found.");
    }

    res.json({ id: deleted.id });
  } catch (error) {
    next(error);
  }
}

function resetBurgers(_req, res) {
  const burgers = store.reset();
  res.json({ burgers });
}

router.get("/", listBurgers);
router.post("/", createBurger);
router.patch("/:id/devour", devourBurger);
router.delete("/:id", deleteBurger);
router.post("/reset", resetBurgers);

module.exports = router;
module.exports.handlers = {
  listBurgers,
  createBurger,
  devourBurger,
  deleteBurger,
  resetBurgers
};
