import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import BibleVerse from "./BibleVerse";

jest.mock("axios");

test("shows a related Bible verse with its reference", async () => {
  axios.get.mockImplementation((url) => {
    if (url === "https://bolls.life/v2/find/WEB") {
      return Promise.resolve({
        data: {
          results: [
            {
              book: 19,
              chapter: 149,
              verse: 3,
              text: "Let them praise his name in the <mark>dance</mark>!",
            },
          ],
        },
      });
    }

    if (url === "https://bolls.life/get-books/WEB/") {
      return Promise.resolve({
        data: [{ bookid: 19, name: "Psalms" }],
      });
    }

    return Promise.reject(new Error("Unexpected request."));
  });

  render(<BibleVerse word="dance" />);

  expect(
    await screen.findByText("Let them praise his name in the dance!"),
  ).toBeInTheDocument();
  expect(screen.getByText("Psalm 149:3")).toBeInTheDocument();
  expect(screen.getByText(/World English Bible/i)).toBeInTheDocument();
});
