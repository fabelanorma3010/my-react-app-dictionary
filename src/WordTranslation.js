import React, { useEffect, useState } from "react";
import { translateChunk } from "./Meaning";
import { languages } from "./languages";
import SpeakButton from "./SpeakButton";
import "./WordTranslation.css";

export default function WordTranslation({
  word,
  originalWord,
  originalSpanishWord,
  sourceLanguage = "en",
  targetLanguage = "es",
}) {
  const searchedWord = originalWord || originalSpanishWord;
  const languageName = languages[targetLanguage];
  const sourceLanguageName = languages[sourceLanguage];
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    setTranslation("");
    if (targetLanguage === "en") {
      setStatus("ready");
      return () => controller.abort();
    }
    setStatus("loading");

    translateChunk(word, controller.signal, targetLanguage)
      .then((translatedWord) => {
        if (!controller.signal.aborted) {
          setTranslation(translatedWord);
          setStatus("ready");
        }
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
              <SpeakButton text={translation} language={targetLanguage} label={`Listen to translated word in ${languageName}`} />
            </>
          )}
        </>
      )}
      {searchedWord && (
        <>
          <strong>{sourceLanguageName} searched word:</strong>{" "}
          <span lang={sourceLanguage}>{searchedWord}</span>
          <SpeakButton text={searchedWord} language={sourceLanguage} label={`Listen to searched word in ${sourceLanguageName}`} />
          <br />
          <strong>English dictionary entry:</strong>{" "}
          <span lang="en">{word}</span>
          {targetLanguage !== "en" && (
            <>
              <br />
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
                  <SpeakButton text={translation} language={targetLanguage} label={`Listen to translated word in ${languageName}`} />
                </>
              )}
            </>
          )}
        </>
      )}
    </p>
  );
}
