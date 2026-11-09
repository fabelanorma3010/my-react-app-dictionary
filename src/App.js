import "./App.css";
import Dictionary from "./dictionary";
import BackgroundMusic from "./BackgroundMusic";

export default function App() {
  return (
    <div className="App">
      <div className="container">
        <main>
          <BackgroundMusic />
          <Dictionary defaultKeyword="sunset" />
        </main>
      </div>
    </div>
  );
}
