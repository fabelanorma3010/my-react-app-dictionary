import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import WordTranslation from "./WordTranslation";

jest.mock("axios");

test("shows the Spanish translation beneath the English word", async () => {
  axios.get.mockResolvedValue({
    data: { responseData: { translatedText: "puesta de sol" } },
  });

  render(<WordTranslation word="sunset" />);

  expect(await screen.findByText("puesta de sol")).toBeInTheDocument();
  expect(screen.getByText("Spanish:")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Listen to translated word in Spanish" })).toBeInTheDocument();
});

test("offers the searched word in its source language", async () => {
  render(<WordTranslation word="sunset" originalWord="coucher de soleil" sourceLanguage="fr" targetLanguage="en" />);
  expect(screen.getByRole("button", { name: "Listen to searched word in French" })).toBeInTheDocument();
});
