import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BibleVerse.css";

function getRelatedWordForms(word) {
  const normalizedWord = word.toLowerCase();
  const forms = new Set([
    normalizedWord,
    `${normalizedWord}s`,
    `${normalizedWord}es`,
    `${normalizedWord}ed`,
    `${normalizedWord}ing`,
  ]);

  if (normalizedWord.endsWith("e")) {
    const stem = normalizedWord.slice(0, -1);
    forms.add(`${stem}d`);
    forms.add(`${stem}ing`);
  }
  if (normalizedWord.endsWith("y")) {
    const stem = normalizedWord.slice(0, -1);
    forms.add(`${stem}ies`);
    forms.add(`${stem}ied`);
  }

  return forms;
}

function containsRelatedWord(text, wordForms) {
  const words = text.toLowerCase().split(/[^a-z]+/);
  return words.some((textWord) => wordForms.has(textWord));
}

export default function BibleVerse({ word }) {
  const [verses, setVerses] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setVerses([]);
    setStatus("loading");

    async function findVerse() {
      try {
        const response = await axios.get(
          "https://bolls.life/v2/find/WEB",
          {
            params: { search: word, match_whole: true, limit: 20 },
            signal: controller.signal,
            timeout: 12000,
          },
        );
        const results = response.data?.results;
        if (!Array.isArray(results) || results.length === 0) {
          setStatus("not-found");
          return;
        }
        const wordForms = getRelatedWordForms(word);
        const relevantResults = results.filter(
          (result) =>
            typeof result.text === "string" &&
            containsRelatedWord(
              result.text.replace(/<\/?mark>/gi, ""),
              wordForms,
            ),
        );
        if (relevantResults.length === 0) {
          setStatus("not-found");
          return;
        }

        const bookResponse = await axios.get("https://bolls.life/get-books/WEB/", {
          signal: controller.signal,
          timeout: 12000,
        });
        const books = new Map(
          (Array.isArray(bookResponse.data) ? bookResponse.data : []).map(
            (book) => [book.bookid, book.name],
          ),
        );
        const uniqueVerses = new Map();

        relevantResults.forEach((result) => {
          const rawBookName = books.get(result.book);
          const text =
            typeof result.text === "string"
              ? result.text.replace(/<\/?mark>/gi, "").trim()
              : "";
          if (!rawBookName || !text) {
            return;
          }

          const bookName = rawBookName === "Psalms" ? "Psalm" : rawBookName;
          const reference = `${bookName} ${result.chapter}:${result.verse}`;
          if (!uniqueVerses.has(reference)) {
            uniqueVerses.set(reference, { reference, text });
          }
        });

        const relatedVerses = Array.from(uniqueVerses.values()).slice(0, 3);
        if (relatedVerses.length === 0) {
          setStatus("not-found");
          return;
        }

        setVerses(relatedVerses);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("unavailable");
        }
      }
    }

    findVerse();
    return () => controller.abort();
  }, [word]);

  return (
    <section className="BibleVerse" aria-label="Related Bible verse">
      <h3>Bible verses related to “{word}”</h3>
      {status === "loading" && (
        <p role="status">Finding a related Bible verse…</p>
      )}
      {status === "not-found" && (
        <p role="status">No related Bible verses were found for “{word}”.</p>
      )}
      {status === "unavailable" && (
        <p role="status">Bible verse lookup is unavailable right now.</p>
      )}
      {verses.map((verse) => (
        <div className="BibleVerse-item" key={verse.reference}>
          <blockquote>{verse.text}</blockquote>
          <p className="BibleVerse-reference">
            <strong>{verse.reference}</strong> · World English Bible
          </p>
        </div>
      ))}
    </section>
  );
}
