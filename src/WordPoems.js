import React from "react";
import "./WordPoems.css";

function getPoems(word) {
  return [
    [
      `The day grows quiet; ${word} glows,`,
      "A little thought the evening knows.",
      "And in that hush, through all I do,",
      "My favorite word still leads to you.",
    ],
    [
      `I write ${word} softly, line by line,`,
      "Then leave a space for your name to shine.",
      "The page can hold a thousand views;",
      "My heart keeps choosing you.",
    ],
  ];
}

export default function WordPoems({ word }) {
  if (!word) {
    return null;
  }

  return (
    <section className="WordPoems">
      <h3>Little poems with “{word}”</h3>
      {getPoems(word).map((lines, index) => (
        <blockquote key={index}>
          {lines.map((line, lineIndex) => (
            <React.Fragment key={line}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </blockquote>
      ))}
      <p>Original poems, just for fun.</p>
    </section>
  );
}
