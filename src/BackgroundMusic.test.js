import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import BackgroundMusic from "./BackgroundMusic";

let contexts;

beforeEach(() => {
  jest.useFakeTimers();
  contexts = [];
  window.AudioContext = jest.fn(function () {
    const master = { gain: { value: 0 }, connect: jest.fn() };
    const envelope = {
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: jest.fn(),
    };
    this.master = master;
    this.destination = {};
    this.currentTime = 0;
    this.resume = jest.fn().mockResolvedValue();
    this.close = jest.fn().mockResolvedValue();
    this.createGain = jest.fn()
      .mockReturnValueOnce(master)
      .mockImplementation(() => envelope);
    this.createOscillator = jest.fn(() => ({
      frequency: { value: 0 },
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }));
    contexts.push(this);
  });
});

afterEach(() => {
  delete window.AudioContext;
  jest.useRealTimers();
});

test("plays only on request, adjusts volume, pauses and resumes", async () => {
  render(<BackgroundMusic />);
  expect(window.AudioContext).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Play music" }));
  await screen.findByRole("button", { name: "Pause music" });
  expect(contexts[0].createOscillator).toHaveBeenCalledTimes(1);
  act(() => jest.advanceTimersByTime(650));
  expect(contexts[0].createOscillator).toHaveBeenCalledTimes(2);
  fireEvent.change(screen.getByRole("slider", { name: "Music volume" }), {
    target: { value: "35" },
  });
  expect(contexts[0].master.gain.value).toBe(0.35);
  fireEvent.click(screen.getByRole("button", { name: "Pause music" }));
  await waitFor(() => expect(contexts[0].close).toHaveBeenCalledTimes(1));
  act(() => jest.advanceTimersByTime(1300));
  expect(contexts[0].createOscillator).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole("button", { name: "Play music" }));
  await screen.findByRole("button", { name: "Pause music" });
  expect(contexts[1].master.gain.value).toBe(0.35);
  expect(contexts[1].createOscillator.mock.results[0].value.frequency.value).toBe(392);
});

test("reports unsupported browsers and playback errors", async () => {
  delete window.AudioContext;
  render(<BackgroundMusic />);
  fireEvent.click(screen.getByRole("button", { name: "Play music" }));
  expect(screen.getByRole("status")).toHaveTextContent("not supported");

  window.AudioContext = jest.fn(() => {
    throw new Error("Audio error");
  });
  fireEvent.click(screen.getByRole("button", { name: "Play music" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Could not play");
});

test("closes audio and stops scheduling on unmount", async () => {
  const { unmount } = render(<BackgroundMusic />);
  fireEvent.click(screen.getByRole("button", { name: "Play music" }));
  await screen.findByRole("button", { name: "Pause music" });
  unmount();
  expect(contexts[0].close).toHaveBeenCalledTimes(1);
  act(() => jest.advanceTimersByTime(1300));
  expect(contexts[0].createOscillator).toHaveBeenCalledTimes(1);
});
