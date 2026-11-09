import "./App.css";
import Dictionary from "./dictionary";
import BackgroundMusic from "./BackgroundMusic";
import GlitterTrail from "./GlitterTrail";

export default function App() {
  return (
    <div className="App">
      <div className="website-stars" aria-hidden="true" />
      <GlitterTrail />
      <div className="opening-curtain" aria-hidden="true">
        <div className="opening-curtain-panel opening-curtain-left" />
        <div className="opening-curtain-panel opening-curtain-right" />
        <div className="opening-spotlight" />
      </div>
      <div className="container">
        <main>
          <BackgroundMusic />
          <Dictionary defaultKeyword="sunset" />
        </main>
      </div>
    </div>
  );
}
