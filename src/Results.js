import React from "react";
import Phonetic from "./Phonetic";
import Meaning from "./Meaning";
import "./Results.css";

export default function Results(props) {
  if (!props.results) {
    return null;
  }

  const phonetics = Array.isArray(props.results.phonetics)
    ? props.results.phonetics
    : [];
  const meanings = Array.isArray(props.results.meanings)
    ? props.results.meanings
    : [];

  return (
    <div className="Results">
      <section>
        <h2>{props.results.word}</h2>
        {phonetics.map(function (phonetic, index) {
          return (
            <div key={index}>
              <Phonetic phonetic={phonetic} word={props.results.word} />
            </div>
          );
        })}
      </section>
      {meanings.map(function (meaning, index) {
        return (
          <section key={index}>
            <Meaning meaning={meaning} />
          </section>
        );
      })}
    </div>
  );
}
