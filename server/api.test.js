const { handlers } = require("./routes/burgers");
const store = require("./store/burgerStore");

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function runHandler(handler, req) {
  const res = createMockRes();

  return new Promise((resolve, reject) => {
    const next = (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(res);
    };

    Promise.resolve(handler(req, res, next))
      .then(() => resolve(res))
      .catch(reject);
  });
}

beforeEach(() => {
  store.reset();
});

describe("Burger API handlers", () => {
  it("creates a burger successfully", async () => {
    const res = await runHandler(handlers.createBurger, {
      body: { burger_name: "Mushroom Melt" }
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      id: 4,
      burger_name: "Mushroom Melt",
      devoured: false
    });
    expect(res.body.created_at).toBeTypeOf("string");
    expect(res.body.updated_at).toBeTypeOf("string");
  });

  it("returns validation errors for invalid burger names", async () => {
    await expect(
      runHandler(handlers.createBurger, {
        body: { burger_name: "   " }
      })
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_BURGER_NAME"
    });

    await expect(
      runHandler(handlers.createBurger, {
        body: { burger_name: "x".repeat(121) }
      })
    ).rejects.toMatchObject({
      status: 400,
      code: "INVALID_BURGER_NAME"
    });
  });

  it("devours an existing burger and returns 404 for unknown ids", async () => {
    const res = await runHandler(handlers.devourBurger, {
      params: { id: "1" },
      body: { devoured: true }
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 1, devoured: true });

    await expect(
      runHandler(handlers.devourBurger, {
        params: { id: "999" },
        body: { devoured: true }
      })
    ).rejects.toMatchObject({
      status: 404,
      code: "BURGER_NOT_FOUND"
    });
  });

  it("deletes a burger and verifies it is removed", async () => {
    const deleteRes = await runHandler(handlers.deleteBurger, {
      params: { id: "2" }
    });

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toEqual({ id: 2 });

    const listRes = await runHandler(handlers.listBurgers, {});
    expect(listRes.body.find((burger) => burger.id === 2)).toBeUndefined();
  });

  it("resets the store and restores id behavior", async () => {
    const createdBeforeReset = await runHandler(handlers.createBurger, {
      body: { burger_name: "Before Reset" }
    });

    expect(createdBeforeReset.body.id).toBe(4);

    const resetRes = await runHandler(handlers.resetBurgers, {});
    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.burgers).toHaveLength(3);

    const createdAfterReset = await runHandler(handlers.createBurger, {
      body: { burger_name: "After Reset" }
    });

    expect(createdAfterReset.body.id).toBe(4);
  });
});
