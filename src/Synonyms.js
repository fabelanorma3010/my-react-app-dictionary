import React from "react";
import SpeakButton from "./SpeakButton";
import "./synonyms.css";

export default function Synonyms(props) {
  if (props.synonyms && props.synonyms.length > 0) {
    return (
      <ul className="Synonyms">
        {props.synonyms.map(function (synonym, index) {
          return <li key={index}>{synonym} <SpeakButton text={synonym} label={`Listen to synonym ${synonym} in English`} /></li>;
        })}
      </ul>
    );
  }

  return null;
}
