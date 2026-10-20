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
});
