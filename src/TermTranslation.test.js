import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TermTranslation from "./TermTranslation";
import { translateChunk } from "./Meaning";

jest.mock("./Meaning", () => ({ translateChunk: jest.fn() }));

beforeEach(() => {
  translateChunk.mockReset();
});

test.each([
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
])("translates a term and definition into %s on request", async (code, language) => {
  translateChunk.mockImplementation((text) => Promise.resolve(`${code}: ${text}`));
  render(
    <TermTranslation term="Contract" definition="A legal agreement." targetLanguage={code} onDemand />,
  );
  expect(translateChunk).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: `Translate Contract to ${language}` }));
  expect(await screen.findByText(`${code}: A legal agreement.`)).toBeInTheDocument();
  expect(screen.getByText(`${code}: Contract:`).closest("div")).toHaveAttribute("lang", code);
  expect(screen.getByRole("button", { name: `Listen to Contract in ${language}` })).toBeInTheDocument();
  expect(translateChunk).toHaveBeenCalledTimes(2);
});

test("translates a definition automatically and reports failures", async () => {
  translateChunk.mockRejectedValue(new Error("Service unavailable"));
  render(<TermTranslation definition="A definition." targetLanguage="fr" />);
  expect(await screen.findByText("French translation is unavailable right now.")).toBeInTheDocument();
});

test("speaks the translated term and definition in the selected language", async () => {
  const speak = jest.fn();
  window.speechSynthesis = { speak, cancel: jest.fn() };
  window.SpeechSynthesisUtterance = jest.fn(function (text) {
    this.text = text;
  });
  translateChunk.mockImplementation((text) =>
    Promise.resolve(text === "Contract" ? "Contrato" : "Un acuerdo legal."),
  );
  render(<TermTranslation term="Contract" definition="A legal agreement." targetLanguage="es" onDemand />);
  fireEvent.click(screen.getByRole("button", { name: "Translate Contract to Spanish" }));
  fireEvent.click(await screen.findByRole("button", { name: "Listen to Contract in Spanish" }));
  expect(speak).toHaveBeenCalledWith(expect.objectContaining({
    text: "Contrato. Un acuerdo legal.",
    lang: "es",
  }));
  delete window.speechSynthesis;
  delete window.SpeechSynthesisUtterance;
});

test("ignores stale translations and does not translate to English", async () => {
  const pending = [];
  translateChunk.mockImplementation((text, signal) =>
    new Promise((resolve) => pending.push({ resolve, signal })),
  );
  const { rerender } = render(<TermTranslation definition="First" targetLanguage="es" />);
  rerender(<TermTranslation definition="Second" targetLanguage="fr" />);
  expect(pending[0].signal.aborted).toBe(true);
  await act(async () => pending[1].resolve("Deuxième"));
  expect(screen.getByText("Deuxième")).toHaveAttribute("lang", "fr");
  await act(async () => pending[0].resolve("Primero"));
  expect(screen.queryByText("Primero")).not.toBeInTheDocument();
  rerender(<TermTranslation definition="Second" targetLanguage="en" />);
  expect(screen.queryByText("Deuxième")).not.toBeInTheDocument();
  expect(translateChunk).toHaveBeenCalledTimes(2);
});
