import React, { useMemo, useState } from "react";
import TermTranslation from "./TermTranslation";
import SpeakButton from "./SpeakButton";
import "./MedicalGlossary.css";

const MEDICAL_TERMS = [
  {
    term: "Alert",
    definition: "Awake and able to respond to the surroundings; clinicians may assess alertness as part of a person's level of consciousness.",
    illustration: "clipboard",
    searchTerms: ["alertness", "consciousness", "mental status"],
  },
  {
    term: "Anemia",
    definition: "A condition in which the blood has too few healthy red blood cells or too little hemoglobin to carry enough oxygen.",
    illustration: "drop",
  },
  {
    term: "Antibiotic",
    definition: "A medicine used to treat certain infections caused by bacteria; it does not treat viral infections.",
    illustration: "clipboard",
    searchTerms: ["antimicrobial", "bacterial infection"],
  },
  {
    term: "Arthritis",
    definition: "Inflammation or other disease of one or more joints, often causing pain or stiffness.",
    illustration: "bone",
  },
  {
    term: "Asthma",
    definition: "A long-term condition in which the airways can become inflamed and narrowed, sometimes making breathing difficult.",
    illustration: "lungs",
  },
  {
    term: "Bacteria",
    definition: "Microscopic single-celled organisms; some cause disease, while many are harmless or helpful.",
    illustration: "cell",
    searchTerms: ["bacterium", "germs"],
  },
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
    term: "Biopsy",
    definition: "A procedure in which a small sample of tissue is taken for examination.",
    illustration: "clipboard",
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
    searchTerms: ["bp", "arterial pressure"],
  },
  {
    term: "Cancer",
    definition: "A group of diseases in which abnormal cells grow and may invade or spread to other parts of the body.",
    illustration: "cell",
    searchTerms: ["malignancy", "malignant tumor"],
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
    searchTerms: ["oedema", "swelling"],
  },
  {
    term: "Fracture",
    definition: "A crack or break in a bone.",
    illustration: "bone",
    searchTerms: ["broken bone"],
  },
  {
    term: "Diabetes",
    definition: "A group of conditions that affect how the body regulates blood glucose.",
    illustration: "drop",
    searchTerms: ["diabetes mellitus", "blood sugar"],
  },
  {
    term: "Glucose",
    definition: "A type of sugar that is an important source of energy for the body's cells.",
    illustration: "drop",
    searchTerms: ["blood glucose", "blood sugar"],
  },
  {
    term: "Heart rate",
    definition: "The number of times the heart beats in a given period, usually measured per minute.",
    illustration: "heart",
    searchTerms: ["pulse rate", "heart beat", "heartbeat"],
  },
  {
    term: "Hypertension",
    definition: "Blood pressure that remains higher than the recommended range.",
    illustration: "heart",
    searchTerms: ["high blood pressure", "elevated blood pressure", "htn"],
  },
  {
    term: "Immune system",
    definition: "The body's network of cells, tissues, and organs that helps defend against infection and disease.",
    illustration: "cell",
    searchTerms: ["immunity", "immune response", "immune"],
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
    searchTerms: ["inflamed"],
  },
  {
    term: "Medication",
    definition: "A substance used to prevent, manage, or treat a disease or condition.",
    illustration: "clipboard",
    searchTerms: ["medicine", "drug", "prescription"],
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
    searchTerms: ["nervous system"],
  },
  {
    term: "Organ",
    definition: "A body structure made of different tissues that work together to perform particular functions.",
    illustration: "cell",
    searchTerms: ["body organ", "organs"],
  },
  {
    term: "Oxygen",
    definition: "A gas that the body uses in cellular processes to release energy from nutrients.",
    illustration: "lungs",
    searchTerms: ["oxygenation"],
  },
  {
    term: "Pulse",
    definition: "The rhythmic expansion of an artery as blood is pumped through it, often felt at the wrist or neck.",
    illustration: "heart",
    searchTerms: ["pulse rate", "heart rate"],
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
    searchTerms: ["breathing"],
  },
  {
    term: "Screening",
    definition: "Testing people who may not have symptoms to look for a condition or estimate their risk.",
    illustration: "clipboard",
    searchTerms: ["screening test", "early detection"],
  },
  {
    term: "Side effect",
    definition: "An unintended effect of a medicine or treatment, which may be harmful, helpful, or neutral.",
    illustration: "clipboard",
    searchTerms: ["adverse effect", "medication reaction"],
  },
  {
    term: "Stroke",
    definition: "A medical emergency that occurs when blood flow to part of the brain is interrupted or bleeding occurs in the brain.",
    illustration: "brain",
    searchTerms: ["cerebrovascular accident", "cva"],
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
    searchTerms: ["vaccination", "immunization", "immunisation"],
  },
  {
    term: "Therapy",
    definition: "Treatment intended to manage or improve a health condition.",
    illustration: "clipboard",
    searchTerms: ["treatment"],
  },
  {
    term: "Tumor",
    definition: "An abnormal mass of tissue that can be benign or malignant.",
    illustration: "cell",
    searchTerms: ["tumour", "neoplasm", "growth"],
  },
  {
    term: "Ultrasound",
    definition: "An imaging method that uses high-frequency sound waves to create pictures of structures inside the body.",
    illustration: "clipboard",
    searchTerms: ["sonogram", "ultrasonography"],
  },
  {
    term: "Virus",
    definition: "A microscopic infectious agent that can reproduce only inside the cells of a living host.",
    illustration: "cell",
    searchTerms: ["viral infection", "viruses"],
  },
];

const LEGAL_TERMS = [
  {
    term: "Affidavit",
    definition: "A written statement of facts that a person swears or affirms is true, typically for use in a legal proceeding.",
    illustration: "clipboard",
    searchTerms: ["sworn statement", "declaration"],
  },
  {
    term: "Appeal",
    definition: "A request for a higher court or authority to review a decision made by a lower court or body.",
    illustration: "clipboard",
    searchTerms: ["appellate review", "challenge a decision"],
  },
  {
    term: "Bail",
    definition: "A process allowing a person accused of a crime to be released from custody while a case proceeds, often subject to conditions.",
    illustration: "clipboard",
    searchTerms: ["pretrial release", "bond"],
  },
  {
    term: "Civil law",
    definition: "The area of law concerned with disputes between people or organizations, rather than criminal prosecutions.",
    illustration: "clipboard",
    searchTerms: ["civil case", "lawsuit"],
  },
  {
    term: "Contract",
    definition: "An agreement that the law may recognize and enforce when the required legal elements are met.",
    illustration: "clipboard",
    searchTerms: ["agreement", "legal contract"],
  },
  {
    term: "Defendant",
    definition: "A person or organization responding to a claim in a civil case or accused in a criminal case.",
    illustration: "clipboard",
    searchTerms: ["accused", "respondent"],
  },
  {
    term: "Evidence",
    definition: "Information or material presented to help establish facts in a legal proceeding.",
    illustration: "clipboard",
    searchTerms: ["proof", "testimony"],
  },
  {
    term: "Felony",
    definition: "A category of serious crime in some legal systems; its definition and consequences depend on the jurisdiction.",
    illustration: "clipboard",
    searchTerms: ["serious crime", "criminal offense"],
  },
  {
    term: "Jurisdiction",
    definition: "The authority of a court or government body to hear a matter or exercise legal power.",
    illustration: "clipboard",
    searchTerms: ["legal authority", "venue"],
  },
  {
    term: "Liability",
    definition: "Legal responsibility for an act, omission, debt, or resulting harm.",
    illustration: "clipboard",
    searchTerms: ["legal responsibility", "responsibility"],
  },
  {
    term: "Plaintiff",
    definition: "A person or organization that brings a civil claim against another party in court.",
    illustration: "clipboard",
    searchTerms: ["claimant", "complainant"],
  },
  {
    term: "Precedent",
    definition: "An earlier court decision that may guide how similar legal questions are decided later.",
    illustration: "clipboard",
    searchTerms: ["case law", "prior decision"],
  },
  {
    term: "Statute",
    definition: "A written law formally enacted by a legislature.",
    illustration: "clipboard",
    searchTerms: ["legislation", "act of parliament", "law"],
  },
  {
    term: "Tort",
    definition: "A civil wrong, other than breach of contract, for which the law may provide a remedy.",
    illustration: "clipboard",
    searchTerms: ["civil wrong", "personal injury claim"],
  },
  {
    term: "Witness",
    definition: "A person who provides information or testimony about facts relevant to a legal proceeding.",
    illustration: "clipboard",
    searchTerms: ["testimony", "eyewitness"],
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

export default function MedicalGlossary({ onSelectTerm, targetLanguage = "en" }) {
  const [filter, setFilter] = useState("");
  const { visibleMedicalTerms, visibleLegalTerms } = useMemo(() => {
    const queryWords = filter.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matchesQuery = ({ term, definition, searchTerms = [] }) => {
      if (queryWords.length === 0) {
        return true;
      }
      const searchableText = [term, definition, ...searchTerms]
        .join(" ")
        .toLocaleLowerCase();
      return queryWords.every((word) => searchableText.includes(word));
    };

    return {
      visibleMedicalTerms: MEDICAL_TERMS.filter(matchesQuery),
      visibleLegalTerms: LEGAL_TERMS.filter(matchesQuery),
    };
  }, [filter]);

  return (
    <section className="MedicalGlossary" aria-labelledby="medical-glossary-title">
      <h2 id="medical-glossary-title">Medical terms</h2>
      <p>
        Browse medical and legal terms, or select a term to look it up.
        The filter searches English terms and definitions.
      </p>
      <label className="medical-glossary-search">
        Filter medical and legal terms
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </label>
      {visibleMedicalTerms.length > 0 && (
        <ul className="medical-glossary-list">
          {visibleMedicalTerms.map(({ term, definition, illustration }) => (
            <li key={term}>
              <MedicalIllustration type={illustration} />
              <h3>{term}</h3>
              <p>{definition}</p>
              <SpeakButton text={`${term}. ${definition}`} label={`Listen to ${term} in English`} />
              <TermTranslation term={term} definition={definition} targetLanguage={targetLanguage} onDemand />
              <button type="button" onClick={() => onSelectTerm(term)}>
                Look up {term}
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Legal terms</h3>
      {visibleLegalTerms.length > 0 ? (
        <ul className="medical-glossary-list">
          {visibleLegalTerms.map(({ term, definition, illustration }) => (
            <li key={term}>
              <MedicalIllustration type={illustration} />
              <h3>{term}</h3>
              <p>{definition}</p>
              <SpeakButton text={`${term}. ${definition}`} label={`Listen to ${term} in English`} />
              <TermTranslation term={term} definition={definition} targetLanguage={targetLanguage} onDemand />
              <button type="button" onClick={() => onSelectTerm(term)}>
                Look up {term}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {visibleMedicalTerms.length === 0 &&
        visibleLegalTerms.length === 0 &&
        <p role="status">No medical or legal terms match “{filter}”.</p>}
      <small>
        These terms are for general educational purposes only and are not
        medical or legal advice.
      </small>
    </section>
  );
}
