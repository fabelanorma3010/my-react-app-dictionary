import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import MedicalDefinitions, {
  getDefinitionsByLabels,
  getMedicalDefinitions,
  LawDefinitions,
} from "./MedicalDefinitions";

jest.mock("axios");

test("extracts only explicitly labeled medical definitions from English", () => {
  const definitions = getMedicalDefinitions(
    [
      "== English ==",
      "=== Noun ===",
      "(anatomy) A muscular organ that pumps blood.",
      "(figurative) The center of one's emotions.",
      "(medicine, pathology) A clinically relevant definition.",
      "== Spanish ==",
      "(medicine) Una definición en español.",
    ].join("\n"),
  );

  expect(definitions).toEqual([
    {
      label: "anatomy",
      definition: "A muscular organ that pumps blood.",
    },
    {
      label: "medicine, pathology",
      definition: "A clinically relevant definition.",
    },
  ]);
});

test("displays medical definitions with Wiktionary attribution", async () => {
  axios.get.mockResolvedValue({
    data: {
      query: {
        pages: {
          123: {
            title: "heart",
            extract:
              "== English ==\n=== Noun ===\n(anatomy) A muscular organ that pumps blood.",
          },
        },
      },
    },
  });

  render(<MedicalDefinitions word="heart" />);

  expect(
    await screen.findByText("A muscular organ that pumps blood."),
  ).toBeInTheDocument();
  expect(screen.getByText("anatomy:")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Wiktionary" }),
  ).toHaveAttribute("href", "https://en.wiktionary.org/wiki/heart");
});

test("extracts only law-labeled definitions", () => {
  const definitions = getDefinitionsByLabels(
    [
      "== English ==",
      "=== Noun ===",
      "A general agreement.",
      "(law) An agreement which the law will enforce.",
      "(legal, historical) A former legal usage.",
      "(medicine) A medical definition.",
      "== German ==",
      "(law) Eine rechtliche Definition.",
    ].join("\n"),
    ["law", "legal", "jurisprudence"],
  );

  expect(definitions).toEqual([
    {
      label: "law",
      definition: "An agreement which the law will enforce.",
    },
    {
      label: "legal",
      definition: "A former legal usage.",
    },
  ]);
});

test("displays law term definitions separately with source attribution", async () => {
  axios.get.mockResolvedValue({
    data: {
      query: {
        pages: {
          456: {
            title: "contract",
            extract:
              "== English ==\n=== Noun ===\n(law) An agreement which the law will enforce.",
          },
        },
      },
    },
  });

  render(<LawDefinitions word="contract" />);

  expect(
    await screen.findByText("An agreement which the law will enforce."),
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Law term definitions" })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Wiktionary" }),
  ).toHaveAttribute("href", "https://en.wiktionary.org/wiki/contract");
});
