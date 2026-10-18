import React, { useState } from "react";
import "./Phonetic.css";

export default function Phonetic(props) {
  const [audioFailed, setAudioFailed] = useState(false);

  function handleListen() {
    const spokenText = props.word || props.phonetic?.text;
    if (!spokenText || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function handleAudioError() {
    setAudioFailed(true);
  }

  const hasAudio = Boolean(props.phonetic && props.phonetic.audio);

  return (
    <div className="Phonetic">
      {hasAudio && !audioFailed && (
        <audio controls onError={handleAudioError} src={props.phonetic.audio} />
      )}
      {(!hasAudio || audioFailed) && (props.word || props.phonetic?.text) && (
        <button type="button" onClick={handleListen}>
          Listen
        </button>
      )}
      {props.phonetic && props.phonetic.text && (
        <span className="text">{props.phonetic.text}</span>
      )}
    </div>
  );
}
