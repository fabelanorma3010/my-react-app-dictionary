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
    const dictionaryUrl = `/api/dictionary/${encodeURIComponent(term)}`;
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
        try {
          const fallbackResponse = await axios.get(
            "https://api.datamuse.com/words",
            {
              params: { sp: term, md: "d", max: 20 },
              timeout: 12000,
            },
          );
          const fallbackEntry = Array.isArray(fallbackResponse.data)
            ? fallbackResponse.data.find(
                (entry) =>
                  entry.word?.toLowerCase() === term.toLowerCase(),
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
            setResults({
              word: fallbackEntry.word,
              phonetics: [],
              meanings: Array.from(meanings.values()),
            });
            return;
          }

          setResults(null);
          setDictionaryError(`No dictionary entry was found for "${term}".`);
          return;
        } catch (fallbackError) {
          if (dictionaryError.response?.status === 404) {
            setResults(null);
            setDictionaryError(`No dictionary entry was found for "${term}".`);
            return;
          }
        }

        setResults(null);
        if (dictionaryError.response?.status === 429) {
          setDictionaryError(
            "Dictionary lookup is temporarily limited. Try again in a moment.",
          );
          return;
        }
        setDictionaryError(
          "Could not load the dictionary entry. Both dictionary services may be temporarily unavailable; try again in a moment.",
        );
      })
      .finally(() => setIsLoading(false));

    const apiKey = process.env.REACT_APP_SHECODES_API_KEY;
    const localImageApiKey =
      process.env.NODE_ENV === "development" ? apiKey : "";
    const imageUrl = localImageApiKey
      ? `https://api.shecodes.io/images/v1/search?query=${encodeURIComponent(
          term,
        )}&key=${encodeURIComponent(localImageApiKey)}`
      : `/api/photos?query=${encodeURIComponent(term)}`;
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
        if (error.response?.status === 503) {
          setPhotoError(
            "Photo search is not configured. Add SHECODES_API_KEY in Vercel Project Settings > Environment Variables, then redeploy.",
          );
          return;
        }
        if (error.response?.status === 401 || error.response?.status === 403) {
          setPhotoError(
            "The photo API key was rejected. Check SHECODES_API_KEY in the deployment environment.",
          );
          return;
        }
        setPhotoError(
          error.response?.data?.error ||
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
          <input
            type="search"
            aria-label="Search for a word"
            value={keyword}
            onChange={handleKeywordChange}
          />
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
