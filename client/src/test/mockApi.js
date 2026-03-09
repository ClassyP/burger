import { vi } from "vitest";

function jsonResponse(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (key) => (key.toLowerCase() === "content-type" ? "application/json" : null)
    },
    json: async () => payload,
    text: async () => JSON.stringify(payload)
  };
}

export function createStatefulApiMock(seed = ["Cheese Burger", "Hamburger", "Pizza Burger"]) {
  let burgers = seed.map((name, index) => ({
    id: index + 1,
    burger_name: name,
    devoured: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  }));
  let nextId = burgers.length + 1;

  return vi.fn(async (input, init = {}) => {
    const method = (init.method || "GET").toUpperCase();
    const rawUrl = typeof input === "string" ? input : input.url;
    const url = rawUrl.replace(/^https?:\/\/[^/]+/, "");

    if (url === "/api/burgers" && method === "GET") {
      return jsonResponse(200, burgers);
    }

    if (url === "/api/burgers" && method === "POST") {
      const { burger_name } = JSON.parse(init.body);
      const trimmed = (burger_name || "").trim();
      if (!trimmed) {
        return jsonResponse(400, {
          error: {
            code: "INVALID_BURGER_NAME",
            message: "burger_name cannot be empty."
          }
        });
      }

      const created = {
        id: nextId,
        burger_name: trimmed,
        devoured: false,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z"
      };
      nextId += 1;
      burgers = [...burgers, created];
      return jsonResponse(201, created);
    }

    if (url.match(/^\/api\/burgers\/\d+\/devour$/) && method === "PATCH") {
      const id = Number(url.split("/")[3]);
      const payload = JSON.parse(init.body || "{}");
      const devoured = typeof payload.devoured === "boolean" ? payload.devoured : true;
      const burger = burgers.find((item) => item.id === id);

      if (!burger) {
        return jsonResponse(404, {
          error: {
            code: "BURGER_NOT_FOUND",
            message: "Burger not found."
          }
        });
      }

      burger.devoured = devoured;
      burger.updated_at = "2026-01-02T00:00:00.000Z";
      return jsonResponse(200, burger);
    }

    if (url.match(/^\/api\/burgers\/\d+$/) && method === "DELETE") {
      const id = Number(url.split("/")[3]);
      burgers = burgers.filter((item) => item.id !== id);
      return jsonResponse(200, { id });
    }

    if (url === "/api/burgers/reset" && method === "POST") {
      burgers = seed.map((name, index) => ({
        id: index + 1,
        burger_name: name,
        devoured: false,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z"
      }));
      nextId = burgers.length + 1;
      return jsonResponse(200, { burgers });
    }

    return jsonResponse(404, {
      error: {
        code: "NOT_FOUND",
        message: "Route not found."
      }
    });
  });
}
