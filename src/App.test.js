import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the dictionary search input", () => {
  render(<App />);
  expect(
    screen.getByRole("searchbox", { name: /search for a word/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("shows decorative opening curtain without blocking interaction", () => {
  const { container } = render(<App />);
  const curtain = container.querySelector(".opening-curtain");
  expect(curtain).toHaveAttribute("aria-hidden", "true");
  expect(curtain.querySelectorAll(".opening-curtain-panel")).toHaveLength(2);
  expect(curtain.querySelector(".opening-spotlight")).toBeInTheDocument();
  expect(screen.getByRole("searchbox", { name: /search for a word/i })).toBeEnabled();
});

test("shows decorative stars without a website light switch", () => {
  const { container } = render(<App />);
  expect(container.querySelector(".website-light")).not.toBeInTheDocument();
  expect(container.querySelector(".website-stars")).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByRole("button", { name: /website light/i })).not.toBeInTheDocument();
});
