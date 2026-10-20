import React from "react";
import "./LoveQuotes.css";

const loveQuoteTemplates = [
  (word) => `“${word}” is lovely, but it still comes second to you.`,
  (word) => `If “${word}” had a love language, it would be finding its way back to you.`,
  (word) => `Somehow, “${word}” reminds me that everything is sweeter with you.`,
  (word) => `“${word}” is a beautiful word; saying your name is even better.`,
  (word) => `Like “${word},” my favorite thought keeps coming back to you.`,
  (word) => `“${word}” belongs in a poem, right beside your name.`,
  (word) => `If love were spelled “${word},” I’d still find a way to make it mean you.`,
  (word) => `“${word}” has a meaning. You have my whole heart.`,
];

function getLoveQuotes(word) {
  const index = Array.from(word).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return [0, 1, 2].map((offset) => {
    const quoteIndex = (index + offset * 3) % loveQuoteTemplates.length;
    return loveQuoteTemplates[quoteIndex](word);
  });
}

export default function LoveQuotes({ word }) {
  if (!word) {
    return null;
  }

  return (
    <section className="LoveQuotes">
      <h3>Love quotes with “{word}”</h3>
      {getLoveQuotes(word).map((quote) => (
        <blockquote key={quote}>{quote}</blockquote>
      ))}
      <p>Original quotes, just for fun.</p>
    </section>
  );
}
