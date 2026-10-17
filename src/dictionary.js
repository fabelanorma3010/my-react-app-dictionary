import React, { useState } from "react";
import "./dictionary.css";
import axios from "axios";

export default function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");

  async function search(event) {
    event.preventDefault();

    const searchTerm = keyword.trim();
    if (!searchTerm) {
      return;
    }

    setEntry(null);
    setError("");

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchTerm)}`;
    try {
      const response = await axios.get(apiUrl);
      setEntry(response.data[0]);
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setError(`No definition found for "${searchTerm}".`);
      } else {
        setError("Unable to load the definition. Please try again.");
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
        <button type="submit">Search</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {entry && (
        <section aria-live="polite">
          <h1>{entry.word}</h1>
          {entry.meanings?.map((meaning, index) => (
            <div key={`${meaning.partOfSpeech}-${index}`}>
              <h2>{meaning.partOfSpeech}</h2>
              {meaning.definitions?.map((definition, definitionIndex) => (
                <p key={definitionIndex}>{definition.definition}</p>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
