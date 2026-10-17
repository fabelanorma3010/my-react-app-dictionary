import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Dictionary from "./dictionary";

jest.mock("axios");

beforeEach(() => {
  jest.clearAllMocks();
});

test("searches for an encoded word and displays the result", async () => {
  axios.get.mockResolvedValue({
    data: [{ word: "ice cream", meanings: [] }],
  });
  render(<Dictionary />);

  const input = screen.getByRole("searchbox", { name: /search for a word/i });
  fireEvent.change(input, { target: { value: "ice cream" } });
  fireEvent.submit(input.closest("form"));

  await waitFor(() => {
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/ice%20cream",
    );
    expect(screen.getByRole("heading", { name: "ice cream" })).toBeInTheDocument();
  });
});

test("shows a message when the word is not found", async () => {
  axios.get.mockRejectedValue({ response: { status: 404 } });
  render(<Dictionary />);

  const input = screen.getByRole("searchbox", { name: /search for a word/i });
  fireEvent.change(input, { target: { value: "notaword" } });
  fireEvent.submit(input.closest("form"));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    'No definition found for "notaword".',
  );
});

test("does not request a definition for an empty search", () => {
  render(<Dictionary />);

  fireEvent.submit(screen.getByRole("searchbox").closest("form"));

  expect(axios.get).not.toHaveBeenCalled();
});
