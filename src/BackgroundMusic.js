import React, { useEffect, useRef, useState } from "react";
import "./BackgroundMusic.css";

const NOTES = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23,
  329.63, 392, 493.88, 392, 293.66, 349.23, 392, 261.63];

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [volume, setVolume] = useState(20);
  const [error, setError] = useState("");
  const playback = useRef(null);
  const generation = useRef(0);
  const nextNote = useRef(0);
  const volumeRef = useRef(20);

  useEffect(() => () => {
    generation.current += 1;
    if (playback.current) {
      clearInterval(playback.current.timer);
      playback.current.context.close().catch((error) => {
        console.error("Could not close the background music audio context.", error);
      });
      playback.current = null;
    }
  }, []);

  async function stop() {
    generation.current += 1;
    const active = playback.current;
    playback.current = null;
    setPlaying(false);
    if (active) {
      clearInterval(active.timer);
      try {
        await active.context.close();
      } catch {
        setError("Could not stop background music.");
      }
    }
  }

  async function play() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      setError("Background music is not supported by this browser.");
      return;
    }

    const id = ++generation.current;
    setStarting(true);
    setError("");
    let context;
    try {
      context = new AudioContext();
      await context.resume();
      if (id !== generation.current) {
        await context.close();
        return;
      }

      const master = context.createGain();
      master.gain.value = volumeRef.current / 100;
      master.connect(context.destination);
      const playNote = () => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const now = context.currentTime;
        oscillator.type = "sine";
        oscillator.frequency.value = NOTES[nextNote.current % NOTES.length];
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(0.25, now + 0.04);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        oscillator.connect(envelope);
        envelope.connect(master);
        oscillator.start(now);
        oscillator.stop(now + 0.7);
        nextNote.current += 1;
      };
      playNote();
      const timer = setInterval(playNote, 650);
      playback.current = { context, master, timer };
      setPlaying(true);
    } catch {
      if (context && context.state !== "closed") {
        try {
          await context.close();
        } catch {
          // Report the playback failure below.
        }
      }
      if (id === generation.current) {
        setError("Could not play background music. Please try again.");
      }
    } finally {
      if (id === generation.current) {
        setStarting(false);
      }
    }
  }

  function changeVolume(event) {
    const nextVolume = Number(event.target.value);
    volumeRef.current = nextVolume;
    setVolume(nextVolume);
    if (playback.current) {
      playback.current.master.gain.value = nextVolume / 100;
    }
  }

  return (
    <section className="BackgroundMusic" aria-label="Background music">
      <button type="button" onClick={playing ? stop : play} disabled={starting}>
        {starting ? "Starting music…" : playing ? "Pause music" : "Play music"}
      </button>
      <label>
        Music volume
        <input type="range" min="0" max="100" value={volume} onChange={changeVolume} />
      </label>
      {error && <span role="status">{error}</span>}
    </section>
  );
}
