import React, { useEffect, useState } from "react";
import { translateChunk } from "./Meaning";
import { languages } from "./languages";
import SpeakButton from "./SpeakButton";
import "./WordJokes.css";

function getJokes(word) {
  return [
    `I looked up “${word}” in the dictionary. It was right where I left it: in alphabetical order.`,
    `I asked “${word}” to tell me a joke, but it said it was at a loss for words.`,
    `Why did “${word}” visit the dictionary? It wanted to find itself.`,
  ];
}

export default function WordJokes({ word, targetLanguage = "en" }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!word || targetLanguage === "en") {
      return undefined;
    }

    const controller = new AbortController();
    setResult({ word, targetLanguage, status: "loading" });
    Promise.all(
      getJokes(word).map((joke) =>
        translateChunk(joke, controller.signal, targetLanguage),
      ),
    )
      .then((translations) => {
        if (!controller.signal.aborted) {
          setResult({ word, targetLanguage, status: "ready", translations });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({ word, targetLanguage, status: "unavailable" });
        }
      });

    return () => controller.abort();
  }, [word, targetLanguage]);

  if (!word) {
    return null;
  }

  const jokes = getJokes(word);
  const currentResult =
    result?.word === word && result?.targetLanguage === targetLanguage
      ? result
      : null;

  return (
    <section className="WordJokes">
      <h3>Jokes with “{word}”</h3>
      <ul>
        {jokes.map((joke, index) => (
          <li key={joke}>
            <span lang="en">{joke}</span>
            <SpeakButton text={joke} label={`Listen to joke ${index + 1} in English`} />
            {targetLanguage !== "en" && currentResult?.status === "ready" && (
              <div>
                <span className="WordJokes-translation" lang={targetLanguage}>
                  {currentResult.translations[index]}
                </span>
                <SpeakButton
                  text={currentResult.translations[index]}
                  language={targetLanguage}
                  label={`Listen to joke ${index + 1} in ${languages[targetLanguage]}`}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {targetLanguage !== "en" && (!currentResult || currentResult.status === "loading") && (
        <p role="status">Translating jokes to {languages[targetLanguage]}…</p>
      )}
      {targetLanguage !== "en" && currentResult?.status === "unavailable" && (
        <p role="status">{languages[targetLanguage]} joke translation is unavailable right now.</p>
      )}
      <p>Original jokes, just for fun.</p>
    </section>
  );
}
