import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import App from "./App";
import { createStatefulApiMock } from "./test/mockApi";

describe("Burger happy path", () => {
  it("creates, devours, deletes, and resets burgers", async () => {
    global.fetch = createStatefulApiMock();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Cheese Burger")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Burger name"), {
      target: { value: "Spicy Stack" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Add Burger" }));

    await waitFor(() => {
      expect(screen.getByText("Spicy Stack")).toBeInTheDocument();
    });

    const readyPanel = screen.getByRole("article", { name: "Ready to Eat" });
    const spicyRow = within(readyPanel).getByText("Spicy Stack").closest("li");
    fireEvent.click(within(spicyRow).getByRole("button", { name: "Devour" }));

    const devouredPanel = screen.getByRole("article", { name: "Devoured" });
    await waitFor(() => {
      expect(within(devouredPanel).getByText("Spicy Stack")).toBeInTheDocument();
    });

    fireEvent.click(within(devouredPanel).getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(screen.queryByText("Spicy Stack")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset to Seed" }));

    await waitFor(() => {
      expect(screen.getByText("Pizza Burger")).toBeInTheDocument();
    });
  });
});
