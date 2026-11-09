import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MedicalGlossary from "./MedicalGlossary";

test("shows common medical terms and definitions", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  expect(
    screen.getByRole("heading", { name: "Medical terms" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Alert" })).toBeInTheDocument();
  expect(screen.getByText("Blood pressure")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Listen to Hypertension in English" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Listen to Contract in English" })).toBeInTheDocument();
  expect(document.querySelectorAll(".medical-illustration")).toHaveLength(56);
  expect(
    screen.getByText("The force of blood pushing against the walls of the arteries."),
  ).toBeInTheDocument();
});

test("filters terms by name or definition", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical and legal terms" }), {
    target: { value: "immune system" },
  });

  expect(screen.getByRole("heading", { name: "Vaccine" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Immune system" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Blood pressure" })).not.toBeInTheDocument();
});

test("searches terms using alternate names and multiple query words", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical and legal terms" }), {
    target: { value: "high blood pressure" },
  });

  expect(screen.getByRole("heading", { name: "Hypertension" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Blood pressure" })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical and legal terms" }), {
    target: { value: "broken bone" },
  });

  expect(screen.getByRole("heading", { name: "Fracture" })).toBeInTheDocument();
});

test("searches legal terms and lets users look them up", () => {
  const onSelectTerm = jest.fn();
  render(<MedicalGlossary onSelectTerm={onSelectTerm} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical and legal terms" }), {
    target: { value: "civil case" },
  });

  expect(screen.getByRole("heading", { name: "Legal terms" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Civil law" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Blood pressure" })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Look up Civil law" }));
  expect(onSelectTerm).toHaveBeenCalledWith("Civil law");
});

test("offers translation in the selected language for medical and legal entries", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} targetLanguage="fr" />);
  expect(screen.getByRole("button", { name: "Translate Hypertension to French" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Translate Contract to French" })).toBeInTheDocument();
});

test("lets users look up a glossary term", () => {
  const onSelectTerm = jest.fn();
  render(<MedicalGlossary onSelectTerm={onSelectTerm} />);

  fireEvent.click(screen.getByRole("button", { name: "Look up Hypertension" }));

  expect(onSelectTerm).toHaveBeenCalledWith("Hypertension");
});

test("shows a message when no terms match the filter", () => {
  render(<MedicalGlossary onSelectTerm={jest.fn()} />);

  fireEvent.change(screen.getByRole("searchbox", { name: "Filter medical and legal terms" }), {
    target: { value: "not a medical term" },
  });

  expect(screen.getByRole("status")).toHaveTextContent(
    "No medical or legal terms match “not a medical term”.",
  );
});
