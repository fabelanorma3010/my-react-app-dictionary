import React, { useEffect, useState } from "react";
import axios from "axios";
import Synonyms from "./Synonyms";
import SpeakButton from "./SpeakButton";
import { languages } from "./languages";

const translationCache = new Map();

function splitTranslationText(text, maxLength = 450) {
  const words = text.split(/\s+/);
  const chunks = [];
  let chunk = "";

  words.forEach((word) => {
    if (chunk && `${chunk} ${word}`.length > maxLength) {
      chunks.push(chunk);
      chunk = word;
    } else {
      chunk = chunk ? `${chunk} ${word}` : word;
    }
  });

  if (chunk) {
    chunks.push(chunk);
  }

  return chunks;
}

async function translateWithGoogle(text, sourceLanguage, targetLanguage, signal) {
  const response = await axios.get(
    "https://translate.googleapis.com/translate_a/single",
    {
      params: {
        client: "gtx",
        sl: sourceLanguage,
        tl: targetLanguage,
        dt: "t",
        q: text,
      },
      signal,
      timeout: 12000,
    },
  );
  const translatedText = Array.isArray(response.data?.[0])
    ? response.data[0]
        .map((segment) => segment?.[0] || "")
        .join("")
    : "";
  if (!translatedText) {
    throw new Error("The translation service returned no translated text.");
  }
  return translatedText;
}

export async function translateText(text, sourceLanguage, targetLanguage, signal) {
  const cacheKey = `${sourceLanguage}|${targetLanguage}|${text}`;
  const cachedTranslation = translationCache.get(cacheKey);
  if (cachedTranslation) {
    return cachedTranslation;
  }

  if (sourceLanguage === "es" && targetLanguage === "en") {
    try {
      const translatedText = await translateWithGoogle(
        text,
        sourceLanguage,
        targetLanguage,
        signal,
      );
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
    }
  }

  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${sourceLanguage}|${targetLanguage}`,
        },
        signal,
        timeout: 12000,
      },
    );
    const translatedText = response.data.responseData?.translatedText;
    const quotaExceeded =
      response.data.responseStatus === 429 ||
      response.data.quotaFinished === true ||
      /used all available free translations|quota/i.test(
        `${translatedText || ""} ${response.data.responseDetails || ""}`,
      );

    if (translatedText && !quotaExceeded) {
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    }
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
  }

  const translatedText = await translateWithGoogle(
    text,
    sourceLanguage,
    targetLanguage,
    signal,
  );
  translationCache.set(cacheKey, translatedText);
  return translatedText;
}

export function translateChunk(text, signal, targetLanguage = "es") {
  return translateText(text, "en", targetLanguage, signal);
}

export default function Meaning(props) {
  const targetLanguage = props.targetLanguage || "es";
  const languageName = languages[targetLanguage];
  const definitions = Array.isArray(props.meaning?.definitions)
    ? props.meaning.definitions
    : [];
  const translationText = JSON.stringify(definitions.map(({ definition, example }) => ({
    definition,
    example,
  })));
  const [translation, setTranslation] = useState(null);
  const [translationStatus, setTranslationStatus] = useState("loading");

  useEffect(() => {
    const entries = JSON.parse(translationText);
    if (entries.length === 0 || targetLanguage === "en") {
      setTranslation(null);
      setTranslationStatus("");
      return undefined;
    }

    const controller = new AbortController();
    setTranslation(null);
    setTranslationStatus("loading");

    async function translate() {
      try {
        async function translateEntry(text) {
          if (!text) return "";
          const translatedChunks = await Promise.all(
            splitTranslationText(text).map((chunk) =>
              translateChunk(chunk, controller.signal, targetLanguage),
            ),
          );
          return translatedChunks.join(" ");
        }
        const translatedEntries = await Promise.all(
          entries.map(async (entry) => ({
            definition: await translateEntry(entry.definition),
            example: await translateEntry(entry.example),
          })),
        );

        if (!controller.signal.aborted) {
          setTranslation(translatedEntries);
          setTranslationStatus("");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setTranslationStatus("unavailable");
        }
      }
    }

    translate();
    return () => controller.abort();
  }, [translationText, targetLanguage]);

  return (
    <div className="Meaning">
      <h3>{props.meaning?.partOfSpeech}</h3>
      {definitions.map(function (definition, index) {
        return (
          <div key={index}>
            <div className="Meaning-definition">
              <strong>Definition:</strong>
              {definition.definition}
              {definition.definition && (
                <SpeakButton
                  text={definition.definition}
                  label={`Listen to ${props.meaning?.partOfSpeech || "dictionary"} definition ${index + 1} in English`}
                />
              )}
              {definition.example && (
                <>
                  <br />
                  <strong>Example:</strong>
                  <em>{definition.example}</em>
                  <SpeakButton
                    text={definition.example}
                    label={`Listen to ${props.meaning?.partOfSpeech || "dictionary"} example ${index + 1} in English`}
                  />
                </>
              )}
              {definition.synonyms && definition.synonyms.length > 0 && (
                <>
                  <br />
                  <strong>Synonyms:</strong>
                  <Synonyms synonyms={definition.synonyms} />
                </>
              )}
            </div>
          </div>
        );
      })}
      {translationStatus === "loading" && (
        <p className="Meaning-translation" role="status">
          Translating to {languageName}…
        </p>
      )}
      {translationStatus === "unavailable" && (
        <p className="Meaning-translation" role="status">
          {languageName} translation is unavailable right now.
        </p>
      )}
      {translation && (
        <div className="Meaning-translation">
          <strong>{languageName} translation:</strong>
          {translation.map((entry, index) => (
            <div key={index}>
              {entry.definition && (
                <>
                  <span lang={targetLanguage}>{entry.definition}</span>
                  <SpeakButton
                    text={entry.definition}
                    language={targetLanguage}
                    label={`Listen to ${props.meaning?.partOfSpeech || "dictionary"} definition ${index + 1} in ${languageName}`}
                  />
                </>
              )}
              {entry.example && (
                <div>
                  <span lang={targetLanguage}>{entry.example}</span>
                  <SpeakButton
                    text={entry.example}
                    language={targetLanguage}
                    label={`Listen to ${props.meaning?.partOfSpeech || "dictionary"} example ${index + 1} in ${languageName}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
