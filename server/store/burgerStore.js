const DEFAULT_SEED_BURGERS = ["Cheese Burger", "Hamburger", "Pizza Burger"];

let burgers = [];
let nextId = 1;

function nowIso() {
  return new Date().toISOString();
}

function cloneBurger(burger) {
  return {
    ...burger
  };
}

function list() {
  return burgers.map(cloneBurger);
}

function reset(seedBurgers = DEFAULT_SEED_BURGERS) {
  burgers = seedBurgers.map((burgerName, index) => {
    const timestamp = nowIso();
    return {
      id: index + 1,
      burger_name: burgerName,
      devoured: false,
      created_at: timestamp,
      updated_at: timestamp
    };
  });
  nextId = burgers.length + 1;
  return list();
}

function create(burgerName) {
  const timestamp = nowIso();
  const burger = {
    id: nextId,
    burger_name: burgerName,
    devoured: false,
    created_at: timestamp,
    updated_at: timestamp
  };

  burgers.push(burger);
  nextId += 1;
  return cloneBurger(burger);
}

function updateDevoured(id, devoured) {
  const burger = burgers.find((item) => item.id === id);
  if (!burger) {
    return null;
  }

  burger.devoured = devoured;
  burger.updated_at = nowIso();
  return cloneBurger(burger);
}

function remove(id) {
  const index = burgers.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const [deleted] = burgers.splice(index, 1);
  return cloneBurger(deleted);
}

reset();

module.exports = {
  DEFAULT_SEED_BURGERS,
  list,
  reset,
  create,
  updateDevoured,
  remove
};
