import "./App.css";
import Dictionary from "./dictionary";

export default function App() {
  return (
    <div className="App">
      <div className="container">
        <main>
          <Dictionary defaultKeyword="sunset" />
        </main>
      </div>
    </div>
  );
}
