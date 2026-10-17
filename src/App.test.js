import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the dictionary search input", () => {
  render(<App />);
  expect(screen.getByRole("searchbox", { name: /search for a word/i })).toBeInTheDocument();
});
