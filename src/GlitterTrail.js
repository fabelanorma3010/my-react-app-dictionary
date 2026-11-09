import React, { useEffect, useRef, useState } from "react";

const LIFETIME = 700;
const INTERVAL = 60;
const MAX_SPARKLES = 12;

export default function GlitterTrail() {
  const [sparkles, setSparkles] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    const preference = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const timers = new Set();
    let lastCreated = -Infinity;

    function clearSparkles() {
      timers.forEach(clearTimeout);
      timers.clear();
      setSparkles([]);
    }

    function onPreferenceChange(event) {
      if (event.matches) clearSparkles();
    }

    function createSparkle(x, y) {
      if (preference?.matches) return;
      const now = Date.now();
      if (now - lastCreated < INTERVAL) return;
      lastCreated = now;
      const id = nextId.current++;
      const sparkle = { id, x, y };
      setSparkles((current) => [...current.slice(-(MAX_SPARKLES - 1)), sparkle]);
      const timer = setTimeout(() => {
        timers.delete(timer);
        setSparkles((current) => current.filter((item) => item.id !== id));
      }, LIFETIME);
      timers.add(timer);
    }

    function onPointerMove(event) {
      if (event.pointerType !== "touch") {
        createSparkle(event.clientX, event.clientY);
      }
    }

    function onTouch(event) {
      const touch = event.changedTouches[0];
      if (touch) createSparkle(touch.clientX, touch.clientY);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchstart", onTouch, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouch, { passive: true, capture: true });
    if (preference?.addEventListener) {
      preference.addEventListener("change", onPreferenceChange);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouch, true);
      window.removeEventListener("touchmove", onTouch, true);
      if (preference?.removeEventListener) {
        preference.removeEventListener("change", onPreferenceChange);
      }
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="glitter-trail" aria-hidden="true">
      {sparkles.map(({ id, x, y }) => (
        <span key={id} className="glitter-sparkle" style={{ left: x, top: y }} />
      ))}
    </div>
  );
}
