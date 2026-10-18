import React, { useState, useEffect, useCallback } from "react";
import "./dictionary.css";
import axios from "axios";
import Results from "./Results";

export default function Dictionary(props) {
  let [keyword, setKeyword] = useState(props.defaultKeyword);
  let [results, setResults] = useState(null);

  function handleResponse(response) {
    setResults(response.data[0] || null);
  }

  const search = useCallback(
    function search(searchTerm) {
      let apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`;
      axios.get(apiUrl).then(handleResponse).catch(() => setResults(null));
    },
    []
  );

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
            value={keyword}
            onChange={handleKeywordChange}
          />
        </form>
        <div className="hint">
          suggested words: sunset, wine, yoga, plant...
        </div>
      </section>
      {results ? <Results results={results} /> : <div>Loading...</div>}
    </div>
  );
}
