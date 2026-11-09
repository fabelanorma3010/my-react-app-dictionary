import React from "react";
import { render, screen } from "@testing-library/react";
import LoveQuotes from "./LoveQuotes";

test("shows original love quotes that include the searched word", () => {
  const { container } = render(<LoveQuotes word="sunset" />);

  expect(
    screen.getByRole("heading", { name: 'Love quotes with “sunset”' }),
  ).toBeInTheDocument();
  expect(container.querySelectorAll("blockquote")).toHaveLength(3);
  expect(screen.getByRole("button", { name: "Listen to love quote 1 in English" })).toBeInTheDocument();
  container.querySelectorAll("blockquote").forEach((quote) => {
    expect(quote.textContent.toLowerCase()).toContain("sunset");
  });
  expect(screen.getByText("Original quotes, just for fun.")).toBeInTheDocument();
});

test("does not render when no word is provided", () => {
  const { container } = render(<LoveQuotes word="" />);

  expect(container).toBeEmptyDOMElement();
});
