import React, { useState } from "react";
import "./dictionary.css";
import axios from "axios";
import Results from "./Results";

export default function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  async function search(event) {
    event.preventDefault();
    const searchTerm = keyword.trim();
    if (!searchTerm) {
      return;
    }

    setResults(null);
    setError("");
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchTerm)}`;
    try {
      const response = await axios.get(apiUrl);
      setResults(response.data[0]);
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setError(`No definition found for "${searchTerm}".`);
      } else {
        setError("Unable to fetch the definition. Please try again.");
      }
    }
  }

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  return (
    <div className="Dictionary">
      <form onSubmit={search}>
        <input
          type="search"
          aria-label="Search for a word"
          value={keyword}
          onChange={handleKeywordChange}
        />
      </form>
      {error && <p role="alert">{error}</p>}
      <Results results={results} />
    </div>
  );
}
