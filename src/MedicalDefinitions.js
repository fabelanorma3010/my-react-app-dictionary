import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MedicalDefinitions.css";

const MEDICAL_LABELS = [
  "anatomy",
  "dentistry",
  "medicine",
  "medical",
  "pathology",
  "pharmacology",
  "physiology",
  "surgery",
  "veterinary",
];

export function getDefinitionsByLabels(extract, acceptedLabels) {
  const englishSection = extract.match(
    /^==\s*English\s*==([\s\S]*?)(?=^==[^=].*==\s*$|$(?![\s\S]))/m,
  );
  if (!englishSection) {
    return [];
  }

  const definitions = [];
  englishSection[1].split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\(([^)]+)\)\s+(.+)$/);
    if (!match) {
      return;
    }

    const labels = match[1]
      .split(/\s*,\s*/)
      .map((label) => label.toLowerCase());
    const matchedLabels = labels.filter((label) =>
      acceptedLabels.includes(label),
    );
    if (matchedLabels.length > 0) {
      definitions.push({
        label: matchedLabels.join(", "),
        definition: match[2].trim(),
      });
    }
  });

  return definitions;
}

export function getMedicalDefinitions(extract) {
  return getDefinitionsByLabels(extract, MEDICAL_LABELS);
}

function DefinitionsByLabel({
  word,
  category,
  labels,
  emptyMessage,
}) {
  const [definitions, setDefinitions] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setDefinitions([]);
    setStatus("loading");

    axios
      .get("https://en.wiktionary.org/w/api.php", {
        params: {
          action: "query",
          format: "json",
          prop: "extracts",
          explaintext: 1,
          titles: word,
          origin: "*",
        },
        signal: controller.signal,
        timeout: 12000,
      })
      .then((response) => {
        const pages = response.data?.query?.pages;
        if (!pages || typeof pages !== "object") {
          throw new Error("Unexpected Wiktionary response.");
        }
        const page = Object.values(pages)[0];
        if (!page || page.missing !== undefined) {
          setStatus("empty");
          return;
        }
        if (typeof page.extract !== "string") {
          throw new Error("Wiktionary returned no definition text.");
        }

        const matchingDefinitions = getDefinitionsByLabels(
          page.extract,
          labels,
        );
        setDefinitions(matchingDefinitions);
        setStatus(matchingDefinitions.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus("unavailable");
        }
      });

    return () => controller.abort();
  }, [word, labels]);

  return (
    <section
      className="MedicalDefinitions"
      aria-labelledby={`${category.toLowerCase()}-definitions`}
    >
      <h3 id={`${category.toLowerCase()}-definitions`}>
        {category} definitions
      </h3>
      {status === "loading" && (
        <p role="status">Looking for {category.toLowerCase()} definitions…</p>
      )}
      {status === "unavailable" && (
        <p role="status">
          {category} definitions are unavailable right now.
        </p>
      )}
      {status === "empty" && (
        <p>{emptyMessage}</p>
      )}
      {status === "ready" && (
        <ul>
          {definitions.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <strong>{item.label}:</strong> {item.definition}
            </li>
          ))}
        </ul>
      )}
      {status === "ready" && (
        <small>
          Definitions from{" "}
          <a
            href={`https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`}
            target="_blank"
            rel="noreferrer"
          >
            Wiktionary
          </a>
          , available under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY-SA license
          </a>
          .
        </small>
      )}
    </section>
  );
}

const LAW_LABELS = ["law", "legal", "jurisprudence"];

export default function MedicalDefinitions({ word }) {
  return (
    <DefinitionsByLabel
      word={word}
      category="Medical"
      labels={MEDICAL_LABELS}
      emptyMessage="No medical definitions were found for this word."
    />
  );
}

export function LawDefinitions({ word }) {
  return (
    <DefinitionsByLabel
      word={word}
      category="Law term"
      labels={LAW_LABELS}
      emptyMessage="No law term definitions were found for this word."
    />
  );
}
