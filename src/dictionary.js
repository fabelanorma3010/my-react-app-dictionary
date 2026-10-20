import React, { useState, useEffect, useCallback } from "react";
import "./dictionary.css";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";
import { translateText } from "./Meaning";

async function lookupDictionaryEntry(term) {
  let lookupError;
  try {
    const response = await axios.get(
      `/api/dictionary/${encodeURIComponent(term)}`,
      { timeout: 12000 },
    );
    if (response.data[0]) {
      return { entry: response.data[0], error: null };
    }
    lookupError = new Error("The dictionary API returned no entry.");
  } catch (error) {
    lookupError = error;
  }

  try {
    const response = await axios.get("https://api.datamuse.com/words", {
      params: { sp: term, md: "d", max: 20 },
      timeout: 12000,
    });
    const fallbackEntry = Array.isArray(response.data)
      ? response.data.find(
          (entry) => entry.word?.toLowerCase() === term.toLowerCase(),
        )
      : null;
    const partOfSpeechNames = {
      n: "noun",
      v: "verb",
      adj: "adjective",
      adv: "adverb",
      pron: "pronoun",
      prep: "preposition",
      conj: "conjunction",
      interj: "interjection",
    };
    const meanings = new Map();

    fallbackEntry?.defs?.forEach((definition) => {
      const [partOfSpeech, ...definitionParts] = definition.split("\t");
      const text = definitionParts.join("\t").trim();
      if (!text) {
        return;
      }

      const name =
        partOfSpeechNames[partOfSpeech] || partOfSpeech || "definition";
      if (!meanings.has(name)) {
        meanings.set(name, { partOfSpeech: name, definitions: [] });
      }
      meanings.get(name).definitions.push({ definition: text });
    });

    if (meanings.size > 0) {
      return {
        entry: {
          word: fallbackEntry.word,
          phonetics: [],
          meanings: Array.from(meanings.values()),
        },
        error: null,
      };
    }
  } catch (error) {
    if (!lookupError) {
      lookupError = error;
    }
  }

  return { entry: null, error: lookupError };
}

export default function Dictionary(props) {
  let [keyword, setKeyword] = useState(props.defaultKeyword);
  let [searchLanguage, setSearchLanguage] = useState("en");
  let [results, setResults] = useState(null);
  let [dictionaryError, setDictionaryError] = useState("");
  let [isLoading, setIsLoading] = useState(true);
  let [photos, setPhotos] = useState(null);
  let [photoError, setPhotoError] = useState("");
  let [originalSpanishWord, setOriginalSpanishWord] = useState("");

  const search = useCallback(function search(searchTerm, sourceLanguage = "en") {
    const term = searchTerm.trim();
    if (!term) {
      setResults(null);
      setOriginalSpanishWord("");
      setDictionaryError("Enter a word to search.");
      setIsLoading(false);
      setPhotos(null);
      setPhotoError("");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setDictionaryError("");
    setOriginalSpanishWord("");
    setPhotos(null);
    setPhotoError("");
    let lookupTerm = term;
    const lookupPromise =
      sourceLanguage === "es"
        ? translateText(term, "es", "en").then((translatedWord) => {
            lookupTerm = translatedWord.trim();
            if (!lookupTerm) {
              throw new Error("The translation service returned no English word.");
            }
            setOriginalSpanishWord(term);
            return lookupDictionaryEntry(lookupTerm);
          })
        : lookupDictionaryEntry(term);

    lookupPromise
      .then(async ({ entry, error }) => {
        if (entry) {
          setResults(entry);
          return;
        }

        if (sourceLanguage !== "es") {
          try {
            const translatedWord = (
              await translateText(term, "es", "en")
            ).trim();
            if (
              translatedWord &&
              translatedWord.toLocaleLowerCase() !== term.toLocaleLowerCase()
            ) {
              const translatedLookup =
                await lookupDictionaryEntry(translatedWord);
              if (translatedLookup.entry) {
                setResults(translatedLookup.entry);
                setOriginalSpanishWord(term);
                return;
              }
            }
          } catch {
            // Keep the dictionary error below as the primary user-facing failure.
          }
        }

        setResults(null);
        if (error?.response?.status === 404) {
          setDictionaryError(
            `No dictionary entry was found for "${lookupTerm}".`,
          );
          return;
        }
        if (error?.response?.status === 429) {
          setDictionaryError(
            "Dictionary lookup is temporarily limited. Try again in a moment.",
          );
          return;
        }
        setDictionaryError(
          sourceLanguage === "es"
            ? `Could not find an English dictionary entry for "${lookupTerm}".`
            : `No dictionary entry was found for "${term}". If this is a Spanish word, its English translation could not be looked up right now.`,
        );
      })
      .catch(() => {
        setResults(null);
        setOriginalSpanishWord("");
        setDictionaryError(
          "Could not translate that Spanish word right now. Check your connection and try again.",
        );
      })
      .finally(() => setIsLoading(false));

    const imageUrl = "https://commons.wikimedia.org/w/api.php";
    axios
      .get(imageUrl, {
        params: {
          action: "query",
          generator: "search",
          gsrsearch: `${term} filetype:bitmap`,
          gsrnamespace: 6,
          gsrlimit: 9,
          prop: "imageinfo",
          iiprop: "url",
          iiurlwidth: 600,
          format: "json",
          origin: "*",
        },
        timeout: 12000,
      })
      .then((response) => {
        const pages = Object.values(response.data.query?.pages || {});
        const imageResults = pages
          .map((page) => {
            const image = page.imageinfo?.[0];
            if (!image?.thumburl && !image?.url) {
              return null;
            }
            return {
              url: image.thumburl || image.url,
              pageUrl: image.descriptionurl,
              title: page.title.replace(/^File:/, "").replace(/_/g, " "),
            };
          })
          .filter(Boolean);
        if (!response.data.query && !response.data.error) {
          throw new Error("Unexpected Wikimedia Commons API response.");
        }
        if (response.data.error) {
          throw new Error(response.data.error.info || "Image search failed.");
        }
        setPhotos(imageResults);
        setPhotoError(
          imageResults.length === 0 ? "No related photos were found." : "",
        );
      })
      .catch((error) => {
        setPhotos(null);
        setPhotoError(
          error.response?.data?.error ||
            "Could not load related photos. Check your connection and try again.",
        );
      });
  }, []);

  useEffect(() => {
    search(props.defaultKeyword, "en");
  }, [props.defaultKeyword, search]);

  function handleSubmit(event) {
    event.preventDefault();
    search(keyword, searchLanguage);
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  return (
    <div className="Dictionary">
      <section>
        <h1>What word do you want to look up?</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            aria-label="Search for a word"
            value={keyword}
            onChange={handleKeywordChange}
          />
          <select
            aria-label="Search language"
            value={searchLanguage}
            onChange={(event) => setSearchLanguage(event.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
          <button type="submit">Search</button>
        </form>
        <div className="hint">
          suggested words: sunset, wine, yoga, plant...
        </div>
      </section>
      {isLoading && <div>Loading...</div>}
      {dictionaryError && <p role="status">{dictionaryError}</p>}
      {results && (
        <Results results={results} originalSpanishWord={originalSpanishWord} />
      )}
      {photoError && <p role="status">{photoError}</p>}
      <Photos photos={photos} />
    </div>
  );
}
