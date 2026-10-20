import React, { useEffect, useState } from "react";
import axios from "axios";
import Synonyms from "./Synonyms";

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
    if (signal.aborted) {
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

export function translateChunk(text, signal) {
  return translateText(text, "en", "es", signal);
}

export default function Meaning(props) {
  const definitions = Array.isArray(props.meaning?.definitions)
    ? props.meaning.definitions
    : [];
  const translationText = definitions
    .map((definition, index) => {
      const example = definition.example
        ? `Example: ${definition.example}`
        : "";
      return [`${index + 1}. ${definition.definition}`, example]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
  const [translation, setTranslation] = useState("");
  const [translationStatus, setTranslationStatus] = useState("loading");

  useEffect(() => {
    if (!translationText) {
      setTranslation("");
      setTranslationStatus("");
      return undefined;
    }

    const controller = new AbortController();
    setTranslation("");
    setTranslationStatus("loading");

    async function translate() {
      try {
        const chunks = splitTranslationText(translationText);
        const translatedChunks = await Promise.all(
          chunks.map((chunk) => translateChunk(chunk, controller.signal)),
        );

        setTranslation(translatedChunks.join(" "));
        setTranslationStatus("");
      } catch (error) {
        if (!controller.signal.aborted) {
          setTranslationStatus("unavailable");
        }
      }
    }

    translate();
    return () => controller.abort();
  }, [translationText]);

  return (
    <div className="Meaning">
      <h3>{props.meaning?.partOfSpeech}</h3>
      {definitions.map(function (definition, index) {
        return (
          <div key={index}>
            <div className="Meaning-definition">
              <strong>Definition:</strong>
              {definition.definition}
              {definition.example && (
                <>
                  <br />
                  <strong>Example:</strong>
                  <em>{definition.example}</em>
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
          Translating to Spanish…
        </p>
      )}
      {translationStatus === "unavailable" && (
        <p className="Meaning-translation" role="status">
          Spanish translation is unavailable right now.
        </p>
      )}
      {translation && (
        <p className="Meaning-translation">
          <strong>Spanish translation:</strong>
          <span>{translation}</span>
        </p>
      )}
    </div>
  );
}
