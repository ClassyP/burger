class ApiError extends Error {
  constructor(message, code, status, details) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorPayload = payload && payload.error ? payload.error : {};
    throw new ApiError(
      errorPayload.message || `Request failed with status ${response.status}`,
      errorPayload.code || "REQUEST_FAILED",
      response.status,
      errorPayload.details
    );
  }

  return payload;
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  return parseResponse(response);
}

export const burgersApi = {
  list() {
    return request("/api/burgers");
  },

  create(burger_name) {
    return request("/api/burgers", {
      method: "POST",
      body: JSON.stringify({ burger_name })
    });
  },

  devour(id, devoured = true) {
    return request(`/api/burgers/${id}/devour`, {
      method: "PATCH",
      body: JSON.stringify({ devoured })
    });
  },

  remove(id) {
    return request(`/api/burgers/${id}`, {
      method: "DELETE"
    });
  },

  reset() {
    return request("/api/burgers/reset", {
      method: "POST"
    });
  }
};

export { ApiError };
