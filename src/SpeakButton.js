import React, { useState } from "react";

export default function SpeakButton({ text, language = "en", label }) {
  const [error, setError] = useState("");

  function handleListen() {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError("Speech playback is not supported by this browser.");
      return;
    }

    setError("");
    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.onerror = (event) => {
        if (event.error !== "interrupted" && event.error !== "canceled") {
          setError("The browser could not play this pronunciation.");
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setError("The browser could not play this pronunciation.");
    }
  }

  return (
    <>
      <button type="button" onClick={handleListen} aria-label={label}>
        Listen
      </button>
      {error && <span role="status">{error}</span>}
    </>
  );
}
