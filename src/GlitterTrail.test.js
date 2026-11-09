import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import GlitterTrail from "./GlitterTrail";

let preference;
let preferenceListener;

beforeEach(() => {
  jest.useFakeTimers();
  preference = {
    matches: false,
    addEventListener: jest.fn((name, listener) => { preferenceListener = listener; }),
    removeEventListener: jest.fn(),
  };
  window.matchMedia = jest.fn(() => preference);
});

afterEach(() => {
  delete window.matchMedia;
  jest.useRealTimers();
});

function move(x, y) {
  const event = new MouseEvent("pointermove", { bubbles: true, clientX: x, clientY: y });
  fireEvent(window, event);
}

test("creates a bounded, temporary decorative trail and cleans up", () => {
  const { container, unmount } = render(<GlitterTrail />);
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  move(25, 50);
  expect(container.querySelector(".glitter-sparkle")).toHaveStyle({ left: "25px", top: "50px" });
  move(30, 60);
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(1);
  for (let i = 0; i < 20; i += 1) {
    act(() => jest.advanceTimersByTime(60));
    move(i, i);
  }
  expect(container.querySelectorAll(".glitter-sparkle").length).toBeLessThanOrEqual(12);
  act(() => jest.advanceTimersByTime(700));
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(0);
  unmount();
  expect(preference.removeEventListener).toHaveBeenCalledWith("change", preferenceListener);
  expect(jest.getTimerCount()).toBe(0);
});

test("disables and clears glitter when reduced motion is enabled", () => {
  const { container } = render(<GlitterTrail />);
  move(25, 50);
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(1);
  preference.matches = true;
  act(() => preferenceListener({ matches: true }));
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(0);
  move(50, 50);
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(0);
});

test("adds glitter at finger touches and during touch scrolling without cancelling it", () => {
  const { container, unmount } = render(<GlitterTrail />);
  const start = new Event("touchstart", { bubbles: true, cancelable: true });
  Object.defineProperty(start, "changedTouches", { value: [{ clientX: 40, clientY: 80 }] });
  fireEvent(window, start);
  expect(container.querySelector(".glitter-sparkle")).toHaveStyle({ left: "40px", top: "80px" });
  expect(start.defaultPrevented).toBe(false);

  act(() => jest.advanceTimersByTime(60));
  const touchMove = new Event("touchmove", { bubbles: true, cancelable: true });
  Object.defineProperty(touchMove, "changedTouches", { value: [{ clientX: 55, clientY: 95 }] });
  fireEvent(window, touchMove);
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(2);
  expect(container.querySelectorAll(".glitter-sparkle")[1]).toHaveStyle({ left: "55px", top: "95px" });
  expect(touchMove.defaultPrevented).toBe(false);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});

test("respects reduced motion for finger touches", () => {
  preference.matches = true;
  const { container } = render(<GlitterTrail />);
  fireEvent.touchStart(window, { changedTouches: [{ clientX: 10, clientY: 20 }] });
  expect(container.querySelectorAll(".glitter-sparkle")).toHaveLength(0);
});
