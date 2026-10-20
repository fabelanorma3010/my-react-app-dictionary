import React from "react";
import { render, screen } from "@testing-library/react";
import FunnyDefinition from "./FunnyDefinition";

test("shows three everyday jokes about dogs and spouses", () => {
  const { container } = render(<FunnyDefinition word="dance" />);

  expect(
    screen.getByRole("heading", { name: "Life with a dog or a spouse" }),
  ).toBeInTheDocument();
  expect(screen.getByText("A few everyday laughs:"))
    .toBeInTheDocument();
  expect(screen.getByText(/not dictionary meanings/)).toBeInTheDocument();
  expect(container.querySelectorAll("blockquote")).toHaveLength(3);
  expect(container.textContent).toMatch(/dog/i);
  expect(container.textContent).toMatch(/spouse/i);
  expect(container.textContent).not.toMatch(/Knock, knock/i);
});

test("does not render when no word is provided", () => {
  const { container } = render(<FunnyDefinition word="" />);

  expect(container).toBeEmptyDOMElement();
});
