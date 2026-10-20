import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BibleVerse.css";

export default function BibleVerse({ word }) {
  const [verse, setVerse] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setVerse(null);
    setStatus("loading");

    async function findVerse() {
      try {
        const response = await axios.get(
          "https://bolls.life/v2/find/WEB",
          {
            params: { search: word, limit: 5 },
            signal: controller.signal,
            timeout: 12000,
          },
        );
        const results = response.data?.results;
        if (!Array.isArray(results) || results.length === 0) {
          setStatus("not-found");
          return;
        }

        const bookResponse = await axios.get("https://bolls.life/get-books/WEB/", {
          signal: controller.signal,
          timeout: 12000,
        });
        const book = Array.isArray(bookResponse.data)
          ? bookResponse.data.find(
              (item) => item.bookid === results[0].book,
            )
          : null;
        const text = results[0].text.replace(/<\/?mark>/gi, "").trim();

        if (!book || !text) {
          throw new Error("The Bible service returned an incomplete verse.");
        }

        const bookName = book.name === "Psalms" ? "Psalm" : book.name;
        setVerse({
          reference: `${bookName} ${results[0].chapter}:${results[0].verse}`,
          text,
        });
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
      <h3>Bible verse related to “{word}”</h3>
      {status === "loading" && (
        <p role="status">Finding a related Bible verse…</p>
      )}
      {status === "not-found" && (
        <p role="status">No related Bible verse was found for “{word}”.</p>
      )}
      {status === "unavailable" && (
        <p role="status">Bible verse lookup is unavailable right now.</p>
      )}
      {verse && (
        <>
          <blockquote>{verse.text}</blockquote>
          <p className="BibleVerse-reference">
            <strong>{verse.reference}</strong> · World English Bible
          </p>
        </>
      )}
    </section>
  );
}
