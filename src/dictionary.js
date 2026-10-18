import React, { useState, useEffect, useCallback } from "react";
import "./dictionary.css";
import axios from "axios";
import Results from "./Results";
import Photos from "./Photos";

export default function Dictionary(props) {
  let [keyword, setKeyword] = useState(props.defaultKeyword);
  let [results, setResults] = useState(null);
  let [dictionaryError, setDictionaryError] = useState("");
  let [isLoading, setIsLoading] = useState(true);
  let [photos, setPhotos] = useState(null);
  let [photoError, setPhotoError] = useState("");

  const search = useCallback(function search(searchTerm) {
    const term = searchTerm.trim();
    if (!term) {
      setResults(null);
      setDictionaryError("Enter a word to search.");
      setIsLoading(false);
      setPhotos(null);
      setPhotoError("");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setDictionaryError("");
    setPhotos(null);
    setPhotoError("");
    const apiKey = process.env.REACT_APP_SHECODES_API_KEY;
    const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
      term,
    )}`;
    axios
      .get(dictionaryUrl, { timeout: 12000 })
      .then((response) => {
        const entry = response.data[0];
        if (!entry) {
          throw new Error("The dictionary API returned no entry.");
        }
        setResults(entry);
      })
      .catch(async (dictionaryError) => {
        if (apiKey) {
          try {
            const fallbackResponse = await axios.get(
              "https://api.shecodes.io/dictionary/v1/define",
              {
                params: { word: term, key: apiKey },
                timeout: 12000,
              },
            );
            const entry = fallbackResponse.data;
            if (typeof entry?.word !== "string") {
              throw new Error("The fallback dictionary returned no entry.");
            }

            setResults({
              word: entry.word,
              phonetics:
                typeof entry.phonetic === "string" && entry.phonetic
                  ? [{ text: entry.phonetic }]
                  : [],
              meanings: Array.isArray(entry.meanings)
                ? entry.meanings.map((meaning) => ({
                    partOfSpeech: meaning.partOfSpeech,
                    definitions: meaning.definition
                      ? [
                          {
                            definition: meaning.definition,
                            example: meaning.example,
                            synonyms: meaning.synonyms,
                          },
                        ]
                      : [],
                  }))
                : [],
            });
            return;
          } catch (fallbackError) {
            setResults(null);
            if (
              fallbackError.response?.status === 401 ||
              fallbackError.response?.status === 403
            ) {
              setDictionaryError(
                "Dictionary lookup failed, and the SheCodes fallback rejected its API key.",
              );
              return;
            }
          }
        }

        setResults(null);
        if (dictionaryError.response?.status === 404) {
          setDictionaryError(`No dictionary entry was found for "${term}".`);
          return;
        }
        setDictionaryError(
          "Could not load the dictionary entry. Check your connection and try again.",
        );
      })
      .finally(() => setIsLoading(false));

    if (!apiKey) {
      setPhotoError(
        "Photo search is not configured. Add REACT_APP_SHECODES_API_KEY to .env.local and restart the app.",
      );
      return;
    }

    const imageUrl = `https://api.shecodes.io/images/v1/search?query=${encodeURIComponent(
      term,
    )}&key=${encodeURIComponent(apiKey)}`;
    axios
      .get(imageUrl, { timeout: 12000 })
      .then((response) => {
        const imageResults = response.data.photos;
        if (!Array.isArray(imageResults)) {
          throw new Error("Unexpected photo API response.");
        }
        setPhotos(imageResults);
        setPhotoError(
          imageResults.length === 0 ? "No related photos were found." : "",
        );
      })
      .catch((error) => {
        setPhotos(null);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setPhotoError(
            "The photo API key was rejected. Check REACT_APP_SHECODES_API_KEY in .env.local.",
          );
          return;
        }
        setPhotoError(
          "Could not load related photos. Check your connection and photo API settings.",
        );
      });
  }, []);

  useEffect(() => {
    search(props.defaultKeyword);
  }, [props.defaultKeyword, search]);

  function handleSubmit(event) {
    event.preventDefault();
    search(keyword);
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  return (
    <div className="Dictionary">
      <section>
        <h1>What word do you want to look up?</h1>
        <form onSubmit={handleSubmit}>
          <input type="search" value={keyword} onChange={handleKeywordChange} />
        </form>
        <div className="hint">
          suggested words: sunset, wine, yoga, plant...
        </div>
      </section>
      {isLoading && <div>Loading...</div>}
      {dictionaryError && <p role="status">{dictionaryError}</p>}
      {results && <Results results={results} />}
      {photoError && <p role="status">{photoError}</p>}
      <Photos photos={photos} />
    </div>
  );
}
