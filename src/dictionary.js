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
    const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
      term,
    )}`;
    axios
      .get(dictionaryUrl)
      .then((response) => {
        const entry = response.data[0];
        if (!entry) {
          setDictionaryError(`No dictionary entry was found for "${term}".`);
          return;
        }
        setResults(entry);
      })
      .catch((error) => {
        setResults(null);
        if (error.response?.status === 404) {
          setDictionaryError(`No dictionary entry was found for "${term}".`);
          return;
        }
        setDictionaryError(
          "Could not load the dictionary entry. Check your connection and try again.",
        );
      })
      .finally(() => setIsLoading(false));

    const apiKey = process.env.REACT_APP_SHECODES_API_KEY;
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
      .get(imageUrl)
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
