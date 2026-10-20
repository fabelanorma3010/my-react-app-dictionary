import React from "react";
import { render, screen } from "@testing-library/react";
import WordPoems from "./WordPoems";

test("shows original poems that include the searched word", () => {
  const { container } = render(<WordPoems word="sunset" />);

  expect(
    screen.getByRole("heading", { name: 'Little poems with “sunset”' }),
  ).toBeInTheDocument();
  expect(container.querySelectorAll("blockquote")).toHaveLength(2);
  container.querySelectorAll("blockquote").forEach((poem) => {
    expect(poem.textContent.toLowerCase()).toContain("sunset");
  });
  expect(screen.getByText("Original poems, just for fun.")).toBeInTheDocument();
});

test("does not render when no word is provided", () => {
  const { container } = render(<WordPoems word="" />);

  expect(container).toBeEmptyDOMElement();
});
