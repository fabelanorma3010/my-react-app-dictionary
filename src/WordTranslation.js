import React, { useEffect, useState } from "react";
import { translateChunk } from "./Meaning";
import "./WordTranslation.css";

export default function WordTranslation({ word, originalSpanishWord }) {
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setTranslation("");
    if (originalSpanishWord) {
      setStatus("ready");
      return () => controller.abort();
    }
    setStatus("loading");

    translateChunk(word, controller.signal)
      .then((translatedWord) => {
        setTranslation(translatedWord);
        setStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus("unavailable");
        }
      });

    return () => controller.abort();
  }, [word, originalSpanishWord]);

  return (
    <p className="WordTranslation">
      {originalSpanishWord && (
        <>
          <strong>Spanish searched word:</strong>{" "}
          <span lang="es">{originalSpanishWord}</span>
          <br />
          <strong>English translation:</strong>{" "}
          <span lang="en">{word}</span>
        </>
      )}
      {!originalSpanishWord && (
        <>
          {status === "loading" && (
            <span role="status">Translating word to Spanish…</span>
          )}
          {status === "unavailable" && (
            <span role="status">Spanish word translation is unavailable.</span>
          )}
          {translation && (
            <>
              <strong>Spanish:</strong> <span lang="es">{translation}</span>
            </>
          )}
        </>
      )}
    </p>
  );
}
