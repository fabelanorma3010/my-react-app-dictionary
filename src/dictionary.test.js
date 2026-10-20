import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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
    if (url === "https://commons.wikimedia.org/w/api.php") {
      return Promise.resolve({
        data: {
          query: {
            pages: {
              123: {
                title: "File:Sunset_over_water.jpg",
                imageinfo: [
                  {
                    thumburl: "https://upload.wikimedia.org/thumb.jpg",
                    descriptionurl: "https://commons.wikimedia.org/wiki/File:Sunset",
                  },
                ],
              },
            },
          },
        },
      });
    }
    return Promise.reject(new Error("Unexpected request."));
  });

  render(<Dictionary defaultKeyword="dance" />);

  expect(
    await screen.findByText("A sequence of rhythmic steps or movements."),
  ).toBeInTheDocument();
  expect(screen.getByText("To move with rhythmic steps.")).toBeInTheDocument();
  expect(
    await screen.findByRole("img", { name: "Sunset over water.jpg" }),
  ).toHaveAttribute("src", "https://upload.wikimedia.org/thumb.jpg");
  expect(axios.get).toHaveBeenCalledWith(
    "https://api.datamuse.com/words",
    {
      params: { sp: "dance", md: "d", max: 20 },
      timeout: 12000,
    },
  );
  expect(axios.get).toHaveBeenCalledWith(
    "https://commons.wikimedia.org/w/api.php",
    expect.objectContaining({
      params: expect.objectContaining({
        action: "query",
        gsrsearch: "dance filetype:bitmap",
        origin: "*",
      }),
    }),
  );
});

test("translates a Spanish search word and looks up its English definition", async () => {
  axios.get.mockImplementation((url, options = {}) => {
    if (url === "https://api.mymemory.translated.net/get") {
      return Promise.resolve({
        data: {
          responseData: {
            translatedText:
              options.params.langpair === "es|en" ? "house" : "casa",
          },
        },
      });
    }
    if (url === "https://translate.googleapis.com/translate_a/single") {
      return Promise.resolve({ data: [[["house"]]] });
    }
    if (url === "/api/dictionary/house") {
      return Promise.resolve({
        data: [
          {
            word: "house",
            phonetics: [],
            meanings: [
              {
                partOfSpeech: "noun",
                definitions: [{ definition: "A building for people to live in." }],
              },
            ],
          },
        ],
      });
    }
    if (url === "https://commons.wikimedia.org/w/api.php") {
      return Promise.resolve({ data: { query: { pages: {} } } });
    }
    if (url === "https://api.datamuse.com/words") {
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(new Error("Unexpected request."));
  });

  render(<Dictionary defaultKeyword="" />);
  fireEvent.change(screen.getByRole("searchbox", { name: "Search for a word" }), {
    target: { value: "casa" },
  });
  fireEvent.change(screen.getByLabelText("Search language"), {
    target: { value: "es" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

  expect(
    await screen.findByText("A building for people to live in."),
  ).toBeInTheDocument();
  expect(screen.getByText("house", { selector: "h2" })).toBeInTheDocument();
  expect(screen.getByText("Spanish searched word:")).toBeInTheDocument();
  expect(screen.getByText("casa", { selector: '[lang="es"]' })).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith(
    "https://translate.googleapis.com/translate_a/single",
    expect.objectContaining({
      params: {
        client: "gtx",
        sl: "es",
        tl: "en",
        dt: "t",
        q: "casa",
      },
    }),
  );
  expect(axios.get).toHaveBeenCalledWith(
    "/api/dictionary/house",
    expect.any(Object),
  );
});
