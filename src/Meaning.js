import React, { useEffect, useState } from "react";
import axios from "axios";
import Synonyms from "./Synonyms";

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
          chunks.map(async (chunk) => {
            const response = await axios.get(
              "https://api.mymemory.translated.net/get",
              {
                params: { q: chunk, langpair: "en|es" },
                signal: controller.signal,
                timeout: 12000,
              },
            );
            const translatedText = response.data.responseData?.translatedText;
            if (!translatedText) {
              throw new Error("The translation service returned no text.");
            }
            return translatedText;
          }),
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
