import React from "react";
import "./FunnyDefinition.css";

const everydayJokes = [
  "I bought my dog a puzzle feeder to slow down dinner. He solved it in 30 seconds, then stared at me like I was the puzzle.",
  "My spouse said, “Pick a movie, but nothing too long.” We've spent 45 minutes scrolling. The opening credits should start any minute now.",
  "We spell W-A-L-K so the dog won't get excited. He knows how to spell it. Now we say “exercise for the human,” and he still brings the leash.",
  "My spouse asked me to take a candid photo. I took 14. Apparently “candid” has a director.",
  "My dog has two beds, the sofa, and half our bed. He still sleeps exactly where I was about to sit. He's not spoiled; he's in real estate.",
  "My spouse asked what I wanted for dinner. I said, “Anything is fine.” Somehow, that was the wrong answer in every cuisine.",
  "My dog brought me his leash at 6 a.m. I said, “Too early.” He looked at me like I was an employee who'd missed a shift.",
  "We agreed to keep the thermostat at one temperature. We now communicate exclusively by secretly changing it and blaming the dog.",
];

function getFunnyDefinitions(word) {
  const index = Array.from(word).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return [0, 1, 2].map((offset) => {
    const jokeIndex = (index + offset * 3) % everydayJokes.length;
    return everydayJokes[jokeIndex];
  });
}

export default function FunnyDefinition({ word }) {
  if (!word) {
    return null;
  }

  return (
    <section className="FunnyDefinition">
      <h3>Life with a dog or a spouse</h3>
      <p className="FunnyDefinition-intro">A few everyday laughs:</p>
      {getFunnyDefinitions(word).map((joke, jokeIndex) => (
        <blockquote key={`${jokeIndex}-${joke}`}>{joke}</blockquote>
      ))}
      <p>Just for fun—not dictionary meanings.</p>
    </section>
  );
}
