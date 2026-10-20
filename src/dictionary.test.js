import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Dictionary from "./dictionary";

jest.mock("axios");

test("uses Datamuse definitions when the Free Dictionary API is unavailable", async () => {
  axios.get.mockImplementation((url) => {
    if (url === "/api/dictionary/dance") {
      return Promise.reject({ response: { status: 530 } });
    }
    if (url === "https://api.datamuse.com/words") {
      return Promise.resolve({
        data: [
          {
            word: "dance",
            defs: [
              "n\tA sequence of rhythmic steps or movements.",
              "v\tTo move with rhythmic steps.",
            ],
          },
        ],
      });
    }
    if (url.startsWith("/api/photos")) {
      return Promise.resolve({ data: { photos: [] } });
    }
    return Promise.reject(new Error("Unexpected request."));
  });

  render(<Dictionary defaultKeyword="dance" />);

  expect(
    await screen.findByText("A sequence of rhythmic steps or movements."),
  ).toBeInTheDocument();
  expect(screen.getByText("To move with rhythmic steps.")).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith(
    "https://api.datamuse.com/words",
    {
      params: { sp: "dance", md: "d", max: 20 },
      timeout: 12000,
    },
  );
});
