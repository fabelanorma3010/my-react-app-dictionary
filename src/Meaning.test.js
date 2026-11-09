import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Meaning from "./Meaning";

jest.mock("axios");

beforeEach(() => {
  window.speechSynthesis = { speak: jest.fn(), cancel: jest.fn() };
  window.SpeechSynthesisUtterance = jest.fn(function (text) {
    this.text = text;
  });
  axios.get.mockReset();
});

afterEach(() => {
  delete window.speechSynthesis;
  delete window.SpeechSynthesisUtterance;
});

test("speaks each English definition separately", () => {
  render(<Meaning targetLanguage="en" meaning={{
    partOfSpeech: "noun",
    definitions: [
      { definition: "A first meaning.", example: "An example.", synonyms: ["sample"] },
      { definition: "A second meaning." },
    ],
  }} />);

  fireEvent.click(screen.getByRole("button", { name: "Listen to noun definition 2 in English" }));
  expect(window.speechSynthesis.speak).toHaveBeenCalledWith(
    expect.objectContaining({ text: "A second meaning.", lang: "en" }),
  );
  expect(screen.getByRole("button", { name: "Listen to noun definition 1 in English" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Listen to noun example 1 in English" }));
  expect(window.speechSynthesis.speak).toHaveBeenLastCalledWith(expect.objectContaining({ text: "An example.", lang: "en" }));
  fireEvent.click(screen.getByRole("button", { name: "Listen to synonym sample in English" }));
  expect(window.speechSynthesis.speak).toHaveBeenLastCalledWith(expect.objectContaining({ text: "sample", lang: "en" }));
  expect(screen.queryByRole("button", { name: /translations in English/ })).not.toBeInTheDocument();
});

test("speaks translated definitions in the selected language", async () => {
  axios.get.mockResolvedValue({
    data: { responseData: { translatedText: "Un sens traduit." } },
  });
  render(<Meaning targetLanguage="fr" meaning={{
    partOfSpeech: "verb",
    definitions: [{ definition: "A unique test meaning." }],
  }} />);

  fireEvent.click(await screen.findByRole("button", { name: "Listen to verb definition 1 in French" }));
  expect(window.speechSynthesis.speak).toHaveBeenCalledWith(
    expect.objectContaining({ text: "Un sens traduit.", lang: "fr" }),
  );
});

test("does not offer translation playback after a translation failure", async () => {
  axios.get.mockRejectedValue(new Error("Unavailable"));
  render(<Meaning targetLanguage="de" meaning={{
    partOfSpeech: "adjective",
    definitions: [{ definition: "Another unique test meaning." }],
  }} />);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("German translation is unavailable"));
  expect(screen.queryByRole("button", { name: /definition 1 in German/ })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Listen to adjective definition 1 in English" })).toBeInTheDocument();
});

test("speaks each translated definition and example independently", async () => {
  axios.get.mockImplementation((url, options) => Promise.resolve({
    data: { responseData: { translatedText: `fr: ${options.params.q}` } },
  }));
  render(<Meaning targetLanguage="fr" meaning={{
    partOfSpeech: "noun",
    definitions: [
      { definition: "Distinct first.", example: "Distinct example." },
      { definition: "Distinct second." },
    ],
  }} />);
  fireEvent.click(await screen.findByRole("button", { name: "Listen to noun definition 2 in French" }));
  expect(window.speechSynthesis.speak).toHaveBeenLastCalledWith(expect.objectContaining({
    text: "fr: Distinct second.", lang: "fr",
  }));
  fireEvent.click(screen.getByRole("button", { name: "Listen to noun example 1 in French" }));
  expect(window.speechSynthesis.speak).toHaveBeenLastCalledWith(expect.objectContaining({
    text: "fr: Distinct example.", lang: "fr",
  }));
});
