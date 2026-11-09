import React, { useEffect, useState } from "react";
import { translateChunk } from "./Meaning";
import { languages } from "./languages";
import SpeakButton from "./SpeakButton";

export default function TermTranslation({
  term,
  definition,
  targetLanguage = "en",
  onDemand = false,
}) {
  const [requested, setRequested] = useState(false);
  const [result, setResult] = useState(null);
  const active = !onDemand || requested;

  useEffect(() => {
    if (!active || targetLanguage === "en") {
      return undefined;
    }

    const controller = new AbortController();
    setResult({ term, definition, targetLanguage, status: "loading" });
    const texts = term ? [term, definition] : [definition];
    Promise.all(texts.map((text) =>
      translateChunk(text, controller.signal, targetLanguage),
    ))
      .then((translations) => {
        if (!controller.signal.aborted) {
          setResult({ term, definition, targetLanguage, status: "ready", translations });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult({ term, definition, targetLanguage, status: "unavailable" });
        }
      });

    return () => controller.abort();
  }, [term, definition, targetLanguage, active]);

  if (targetLanguage === "en") {
    return null;
  }

  const current = result?.term === term &&
    result?.definition === definition &&
    result?.targetLanguage === targetLanguage ? result : null;
  const language = languages[targetLanguage];

  return (
    <div className="term-translation">
      {onDemand && !requested && (
        <button type="button" onClick={() => setRequested(true)}>
          Translate {term} to {language}
        </button>
      )}
      {active && (!current || current.status === "loading") && (
        <p role="status">Translating to {language}…</p>
      )}
      {active && current?.status === "unavailable" && (
        <p role="status">{language} translation is unavailable right now.</p>
      )}
      {active && current?.status === "ready" && (
        <div lang={targetLanguage}>
          {term && <strong>{current.translations[0]}: </strong>}
          <span lang={targetLanguage}>{current.translations[term ? 1 : 0]}</span>
          <SpeakButton
            text={current.translations.join(". ")}
            language={targetLanguage}
            label={`Listen to ${term || "definition"} in ${language}`}
          />
        </div>
      )}
    </div>
  );
}
