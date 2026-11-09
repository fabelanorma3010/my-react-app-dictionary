import React, { useEffect, useState } from "react";
import { translateChunk } from "./Meaning";
import { languages } from "./languages";
import "./WordTranslation.css";

export default function WordTranslation({
  word,
  originalWord,
  originalSpanishWord,
  targetLanguage = "es",
}) {
  const searchedWord = originalWord || originalSpanishWord;
  const languageName = languages[targetLanguage];
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setTranslation("");
    if (searchedWord) {
      setStatus("ready");
      return () => controller.abort();
    }
    setStatus("loading");

    translateChunk(word, controller.signal, targetLanguage)
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
  }, [word, searchedWord, targetLanguage]);

  return (
    <p className="WordTranslation">
      {searchedWord && (
        <>
          <strong>{languageName} searched word:</strong>{" "}
          <span lang={targetLanguage}>{searchedWord}</span>
          <br />
          <strong>English translation:</strong>{" "}
          <span lang="en">{word}</span>
        </>
      )}
      {!searchedWord && (
        <>
          {status === "loading" && (
            <span role="status">Translating word to {languageName}…</span>
          )}
          {status === "unavailable" && (
            <span role="status">{languageName} word translation is unavailable.</span>
          )}
          {translation && (
            <>
              <strong>{languageName}:</strong>{" "}
              <span lang={targetLanguage}>{translation}</span>
            </>
          )}
        </>
      )}
    </p>
  );
}
