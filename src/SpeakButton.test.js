import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import SpeakButton from "./SpeakButton";

afterEach(() => {
  delete window.speechSynthesis;
  delete window.SpeechSynthesisUtterance;
});

test("speaks the requested text using its language", () => {
  const speak = jest.fn();
  const cancel = jest.fn();
  window.speechSynthesis = { speak, cancel };
  window.SpeechSynthesisUtterance = jest.fn(function (text) {
    this.text = text;
  });

  render(<SpeakButton text="Bonjour" language="fr" label="Listen in French" />);
  fireEvent.click(screen.getByRole("button", { name: "Listen in French" }));
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(speak).toHaveBeenCalledWith(expect.objectContaining({ text: "Bonjour", lang: "fr" }));
});

test("reports unsupported speech and playback failures", () => {
  const { rerender } = render(<SpeakButton text="Hello" />);
  fireEvent.click(screen.getByRole("button", { name: "Listen" }));
  expect(screen.getByRole("status")).toHaveTextContent("not supported");

  window.speechSynthesis = { speak: jest.fn(), cancel: jest.fn() };
  window.SpeechSynthesisUtterance = jest.fn(function (text) {
    this.text = text;
  });
  rerender(<SpeakButton text="Hello" />);
  fireEvent.click(screen.getByRole("button", { name: "Listen" }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  const utterance = window.speechSynthesis.speak.mock.calls[0][0];
  fireEvent.click(screen.getByRole("button", { name: "Listen" }));
  act(() => utterance.onerror({ error: "interrupted" }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  const currentUtterance = window.speechSynthesis.speak.mock.calls[1][0];
  act(() => currentUtterance.onerror({ error: "voice-unavailable" }));
  expect(screen.getByRole("status")).toHaveTextContent("could not play");
});
