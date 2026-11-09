import React from "react";
import Phonetic from "./Phonetic";
import Meaning from "./Meaning";
import BibleVerse from "./BibleVerse";
import LoveQuotes from "./LoveQuotes";
import WordPoems from "./WordPoems";
import WordJokes from "./WordJokes";
import WordTranslation from "./WordTranslation";
import SpeakButton from "./SpeakButton";
import MedicalDefinitions, { LawDefinitions } from "./MedicalDefinitions";
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
        <SpeakButton text={props.results.word} label={`Listen to ${props.results.word} in English`} />
        <WordTranslation
          word={props.results.word}
          originalWord={props.originalWord}
          originalSpanishWord={props.originalSpanishWord}
          sourceLanguage={props.sourceLanguage}
          targetLanguage={props.targetLanguage}
        />
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
            <Meaning meaning={meaning} targetLanguage={props.targetLanguage} />
          </section>
        );
      })}
      <LoveQuotes word={props.results.word} />
      <WordPoems word={props.results.word} />
      <WordJokes word={props.results.word} targetLanguage={props.targetLanguage || "es"} />
      <BibleVerse word={props.results.word} />
      <MedicalDefinitions word={props.results.word} targetLanguage={props.targetLanguage} />
      <LawDefinitions word={props.results.word} targetLanguage={props.targetLanguage} />
    </div>
  );
}
