import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MedicalGlossary from "./MedicalGlossary";

test("shows common medical terms and definitions", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  expect(
    screen.getByRole("heading", { name: "Medical terms" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Blood pressure")).toBeInTheDocument();
  expect(document.querySelectorAll(".medical-illustration")).toHaveLength(20);
  expect(
    screen.getByText("The force of blood pushing against the walls of the arteries."),
  ).toBeInTheDocument();
});

test("filters terms by name or definition", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical terms" }), {
    target: { value: "immune system" },
  });

  expect(screen.getByRole("heading", { name: "Vaccine" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Blood pressure" })).not.toBeInTheDocument();
});

test("lets users look up a glossary term", () => {
  const onSelectTerm = jest.fn();
  render(<MedicalGlossary onSelectTerm={onSelectTerm} />);

  fireEvent.click(screen.getByRole("button", { name: "Look up Hypertension" }));

  expect(onSelectTerm).toHaveBeenCalledWith("Hypertension");
});

test("shows a message when no terms match the filter", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical terms" }), {
    target: { value: "not a medical term" },
  });

  expect(screen.getByRole("status")).toHaveTextContent(
    "No medical terms match “not a medical term”.",
  );
});
