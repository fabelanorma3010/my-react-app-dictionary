import React from "react";
import Synonyms from "./Synonyms";

export default function Meaning(props) {
  const definitions = Array.isArray(props.meaning?.definitions)
    ? props.meaning.definitions
    : [];

  return (
    <div className="Meaning">
      <h3>{props.meaning?.partOfSpeech}</h3>
      {definitions.map(function (definition, index) {
        return (
          <div key={index}>
            <p>
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
            </p>
          </div>
        );
      })}
    </div>
  );
}
