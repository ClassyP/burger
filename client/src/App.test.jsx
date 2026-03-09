import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import App from "./App";
import { createStatefulApiMock } from "./test/mockApi";

describe("App UI", () => {
  it("renders initial ready-to-eat and devoured sections", async () => {
    global.fetch = createStatefulApiMock();

    render(<App />);

    expect(screen.getByText("Loading burgers...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Cheese Burger")).toBeInTheDocument();
    });

    expect(screen.getByRole("article", { name: "Ready to Eat" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Devoured" })).toBeInTheDocument();
    expect(screen.getByText("Nothing devoured yet.")).toBeInTheDocument();
  });

  it("shows inline API error messages", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      headers: {
        get: () => "application/json"
      },
      json: async () => ({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Something broke."
        }
      }),
      text: async () => ""
    }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Something broke.")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Burger name"), {
      target: { value: "" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Burger" }));
    expect(screen.getByText("Burger name is required.")).toBeInTheDocument();
  });
});
