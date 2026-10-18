import React, { useState } from "react";
import "./Phonetic.css";

export default function Phonetic(props) {
  const [error, setError] = useState("");

  function handleListen() {
    const spokenText = props.word || props.phonetic?.text;
    if (!spokenText) {
      return;
    }

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setError("Speech playback is not supported by this browser.");
      return;
    }

    setError("");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    utterance.onerror = () => {
      setError("The browser could not play this pronunciation.");
    };
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="Phonetic">
      {(props.word || props.phonetic?.text) && (
        <button type="button" onClick={handleListen}>
          Listen
        </button>
      )}
      {props.phonetic && props.phonetic.text && (
        <span className="text">{props.phonetic.text}</span>
      )}
      {error && <span role="status">{error}</span>}
    </div>
  );
}
