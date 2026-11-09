import React from "react";
import SpeakButton from "./SpeakButton";
import "./Phonetic.css";

export default function Phonetic(props) {
  return (
    <div className="Phonetic">
      {(props.word || props.phonetic?.text) && (
        <SpeakButton text={props.word || props.phonetic.text} language="en-US" />
      )}
      {props.phonetic && props.phonetic.text && (
        <span className="text">{props.phonetic.text}</span>
      )}
    </div>
  );
}
