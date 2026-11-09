import React from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import WordJokes from "./WordJokes";
import { translateChunk } from "./Meaning";

jest.mock("./Meaning", () => ({
  translateChunk: jest.fn(),
}));

beforeEach(() => {
  translateChunk.mockReset();
});

test("shows jokes using the searched word and updates for a new word", () => {
  const { rerender } = render(<WordJokes word="sunset" />);

  expect(screen.getByRole("heading", { name: "Jokes with “sunset”" })).toBeInTheDocument();
  const jokes = within(screen.getByRole("list")).getAllByRole("listitem");
  expect(jokes).toHaveLength(3);
  expect(screen.getByRole("button", { name: "Listen to joke 1 in English" })).toBeInTheDocument();
  jokes.forEach((joke) => expect(joke).toHaveTextContent("sunset"));
  expect(screen.getByText("Original jokes, just for fun.")).toBeInTheDocument();

  rerender(<WordJokes word="dance" />);
  expect(screen.getByRole("heading", { name: "Jokes with “dance”" })).toBeInTheDocument();
  expect(screen.queryByText(/sunset/)).not.toBeInTheDocument();
});

test("does not render when no word is provided", () => {
  const { container } = render(<WordJokes word="" />);
  expect(container).toBeEmptyDOMElement();
});

test.each([
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["pt", "Portuguese"],
])("translates each joke into %s", async (language, name) => {
  translateChunk.mockImplementation((text, signal, target) =>
    Promise.resolve(`${target}: ${text}`),
  );
  render(<WordJokes word="sunset" targetLanguage={language} />);

  expect(screen.getByRole("status")).toHaveTextContent(`Translating jokes to ${name}`);
  await waitFor(() => {
    expect(document.querySelectorAll(`.WordJokes-translation[lang="${language}"]`)).toHaveLength(3);
  });
  expect(screen.getByRole("button", { name: `Listen to joke 1 in ${name}` })).toBeInTheDocument();
  expect(translateChunk).toHaveBeenCalledTimes(3);
  expect(translateChunk).toHaveBeenCalledWith(
    expect.stringContaining("sunset"), expect.any(AbortSignal), language,
  );
});

test("keeps English jokes visible and reports translation failures", async () => {
  translateChunk.mockRejectedValue(new Error("Service unavailable"));
  render(<WordJokes word="sunset" targetLanguage="fr" />);

  expect(await screen.findByText("French joke translation is unavailable right now.")).toBeInTheDocument();
  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
});

test("ignores translations from a previous language or word", async () => {
  const pending = [];
  translateChunk.mockImplementation((text, signal, target) =>
    new Promise((resolve) => pending.push({ resolve, signal, target })),
  );
  const { rerender } = render(<WordJokes word="sunset" targetLanguage="es" />);
  rerender(<WordJokes word="dance" targetLanguage="fr" />);

  expect(pending.slice(0, 3).every(({ signal }) => signal.aborted)).toBe(true);
  await act(async () => {
    pending.slice(3).forEach(({ resolve }) => resolve("French joke"));
  });
  expect(document.querySelectorAll('.WordJokes-translation[lang="fr"]')).toHaveLength(3);
  await act(async () => {
    pending.slice(0, 3).forEach(({ resolve }) => resolve("Old joke"));
  });
  expect(screen.queryByText("Old joke")).not.toBeInTheDocument();
  expect(screen.getAllByText("French joke")).toHaveLength(3);

  rerender(<WordJokes word="dance" targetLanguage="en" />);
  expect(document.querySelectorAll(".WordJokes-translation")).toHaveLength(0);
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
