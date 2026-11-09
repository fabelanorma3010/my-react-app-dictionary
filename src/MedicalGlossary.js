import React, { useMemo, useState } from "react";
import "./MedicalGlossary.css";

const MEDICAL_TERMS = [
  {
    term: "Acute",
    definition: "Describes a condition that begins suddenly or lasts a relatively short time.",
    illustration: "clipboard",
  },
  {
    term: "Anatomy",
    definition: "The study of the structures of the body and how they are arranged.",
    illustration: "cell",
  },
  {
    term: "Benign",
    definition: "Describes a growth that is not cancerous; it can still sometimes cause health problems.",
    illustration: "cell",
  },
  {
    term: "Blood pressure",
    definition: "The force of blood pushing against the walls of the arteries.",
    illustration: "heart",
  },
  {
    term: "Chronic",
    definition: "Describes a condition that lasts a long time or returns repeatedly.",
    illustration: "clipboard",
  },
  {
    term: "Diagnosis",
    definition: "The identification of a disease or condition based on available information.",
    illustration: "clipboard",
  },
  {
    term: "Edema",
    definition: "Swelling caused by excess fluid collecting in body tissues.",
    illustration: "drop",
  },
  {
    term: "Fracture",
    definition: "A crack or break in a bone.",
    illustration: "bone",
  },
  {
    term: "Heart rate",
    definition: "The number of times the heart beats in a given period, usually measured per minute.",
    illustration: "heart",
  },
  {
    term: "Hypertension",
    definition: "Blood pressure that remains higher than the recommended range.",
    illustration: "heart",
  },
  {
    term: "Infection",
    definition: "The presence and multiplication of disease-causing microorganisms in the body.",
    illustration: "cell",
  },
  {
    term: "Inflammation",
    definition: "The body's response to injury or infection, which may cause redness, warmth, swelling, or pain.",
    illustration: "drop",
  },
  {
    term: "Metabolism",
    definition: "The chemical processes the body uses to maintain life and transform energy and substances.",
    illustration: "molecule",
  },
  {
    term: "Neurology",
    definition: "The branch of medicine concerned with the brain, spinal cord, and nerves.",
    illustration: "brain",
  },
  {
    term: "Prognosis",
    definition: "An estimate of how a condition may develop and its likely outcome.",
    illustration: "clipboard",
  },
  {
    term: "Respiration",
    definition: "The process of breathing and exchanging oxygen and carbon dioxide.",
    illustration: "lungs",
  },
  {
    term: "Symptom",
    definition: "A change in how a person feels or functions that may be associated with a condition.",
    illustration: "clipboard",
  },
  {
    term: "Tissue",
    definition: "A group of similar cells that work together to perform a function in the body.",
    illustration: "cell",
  },
  {
    term: "Vaccine",
    definition: "A preparation that trains the immune system to recognize and help defend against a specific infection.",
    illustration: "cell",
  },
  {
    term: "Virus",
    definition: "A microscopic infectious agent that can reproduce only inside the cells of a living host.",
    illustration: "cell",
  },
];

function MedicalIllustration({ type }) {
  return (
    <svg
      className="medical-illustration"
      viewBox="0 0 96 96"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="48" cy="48" r="44" fill="#f3edff" />
      {type === "heart" && (
        <>
          <path
            d="M48 72 22 48C9 34 29 18 42 32l6 7 6-7c13-14 33 2 20 16Z"
            fill="#f28a9b"
            stroke="#aa4265"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M18 51h16l6-11 9 23 7-14 5 7h17"
            fill="none"
            stroke="#633d93"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "brain" && (
        <>
          <path
            d="M47 25c-8-10-22-3-20 8-11 3-10 18-2 21-4 12 7 20 17 14 4 8 11 6 11 0V30c0-4-2-6-6-5Z"
            fill="#f3a5bd"
            stroke="#aa4265"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M49 25c8-10 22-3 20 8 11 3 10 18 2 21 4 12-7 20-17 14-4 8-11 6-11 0V30c0-4 2-6 6-5Z"
            fill="#f7bacb"
            stroke="#aa4265"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M31 38c6-2 9 2 8 7m-13 9c6-3 10 0 10 5m29-21c-6-2-9 2-8 7m13 9c-6-3-10 0-10 5"
            fill="none"
            stroke="#aa4265"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {type === "lungs" && (
        <>
          <path
            d="M44 25v24M52 25v24M48 45 34 56M48 45l14 11"
            fill="none"
            stroke="#633d93"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M38 43c-8 1-19 15-19 27 0 8 7 10 14 5l13-10V45Zm20 0c8 1 19 15 19 27 0 8-7 10-14 5L50 65V45Z"
            fill="#9ad7e7"
            stroke="#417b9a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "bone" && (
        <path
          d="M31 31c-5-7-15-2-11 6 1 2 3 3 5 4l29 29c1 2 2 4 4 5 8 4 13-6 6-11 5-7 0-15-8-11L37 34c1-8-7-13-13-8"
          fill="#fffdf5"
          stroke="#aa8456"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {type === "cell" && (
        <>
          <circle cx="48" cy="48" r="25" fill="#b9a5ef" stroke="#6840a8" strokeWidth="3" />
          <circle cx="49" cy="47" r="9" fill="#f3a5bd" stroke="#aa4265" strokeWidth="3" />
          <circle cx="33" cy="43" r="3" fill="#6840a8" />
          <circle cx="61" cy="59" r="4" fill="#6840a8" />
          <circle cx="57" cy="34" r="2.5" fill="#6840a8" />
          <path d="M26 50c2 11 10 18 20 21" fill="none" stroke="#fff" strokeWidth="2" />
        </>
      )}
      {type === "drop" && (
        <>
          <path
            d="M48 22C40 36 27 49 27 61a21 21 0 0 0 42 0C69 49 56 36 48 22Z"
            fill="#f28a9b"
            stroke="#aa4265"
            strokeWidth="3"
          />
          <path d="M38 63c1 6 5 10 11 11" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {type === "molecule" && (
        <>
          <path d="m31 35 17 13 19-16M48 48l-4 21m4-21 22 15" fill="none" stroke="#633d93" strokeWidth="3" />
          <circle cx="31" cy="35" r="8" fill="#f28a9b" />
          <circle cx="67" cy="32" r="8" fill="#9ad7e7" />
          <circle cx="48" cy="48" r="9" fill="#b9a5ef" />
          <circle cx="44" cy="69" r="8" fill="#f6c76d" />
          <circle cx="70" cy="63" r="8" fill="#8bcfa5" />
        </>
      )}
      {type === "clipboard" && (
        <>
          <rect x="27" y="27" width="42" height="48" rx="5" fill="#fff" stroke="#6840a8" strokeWidth="3" />
          <rect x="38" y="21" width="20" height="12" rx="4" fill="#b9a5ef" stroke="#6840a8" strokeWidth="3" />
          <path d="M36 44h24M36 54h24M36 64h16" stroke="#8c7aa8" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function MedicalGlossary({ onSelectTerm }) {
  const [filter, setFilter] = useState("");
  const visibleTerms = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase();
    if (!query) {
      return MEDICAL_TERMS;
    }

    return MEDICAL_TERMS.filter(
      ({ term, definition }) =>
        term.toLocaleLowerCase().includes(query) ||
        definition.toLocaleLowerCase().includes(query),
    );
  }, [filter]);

  return (
    <section className="MedicalGlossary" aria-labelledby="medical-glossary-title">
      <h2 id="medical-glossary-title">Medical terms</h2>
      <p>
        Browse common health and biology terms, or select a term to look it up.
      </p>
      <label className="medical-glossary-search">
        Filter medical terms
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </label>
      {visibleTerms.length > 0 ? (
        <ul className="medical-glossary-list">
          {visibleTerms.map(({ term, definition, illustration }) => (
            <li key={term}>
              <MedicalIllustration type={illustration} />
              <h3>{term}</h3>
              <p>{definition}</p>
              <button type="button" onClick={() => onSelectTerm(term)}>
                Look up {term}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status">No medical terms match “{filter}”.</p>
      )}
      <small>
        This glossary is for general educational purposes and is not medical
        advice.
      </small>
    </section>
  );
}
