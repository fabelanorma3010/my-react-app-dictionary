import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import Photos from "./Photos";

const photos = [
  { url: "https://example.com/one.jpg", title: "First image" },
  { url: "https://example.com/two.jpg", title: "Second image" },
];

function pointerEvent(element, type, coordinates) {
  const event = createEvent[type](element, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    isPrimary: { value: true },
    button: { value: 0 },
    clientX: { value: coordinates[0] },
    clientY: { value: coordinates[1] },
  });
  fireEvent(element, event);
}

test("reorders photos with the keyboard", () => {
  render(<Photos photos={photos} />);

  const firstImage = screen.getByAltText("First image");
  const secondImage = screen.getByAltText("Second image");
  const firstMoveButton = screen.getByRole("button", {
    name: /drag to move first image/i,
  });

  fireEvent.keyDown(firstMoveButton, { key: "ArrowRight" });

  expect(
    firstImage.compareDocumentPosition(secondImage) &
      Node.DOCUMENT_POSITION_PRECEDING,
  ).toBeTruthy();
});

test("reorders photos by dragging the image and suppresses navigation", () => {
  const originalElementFromPoint = document.elementFromPoint;
  document.elementFromPoint = jest.fn(() => {
    return document.querySelector('[data-photo-index="1"]');
  });
  render(<Photos photos={photos} />);

  const firstImage = screen.getByAltText("First image");
  firstImage.setPointerCapture = jest.fn();
  pointerEvent(firstImage, "pointerDown", [10, 10]);
  pointerEvent(firstImage, "pointerMove", [100, 100]);
  expect(document.querySelector(".photos-drag-preview")).toBeInTheDocument();
  pointerEvent(firstImage, "pointerUp", [100, 100]);
  document.elementFromPoint = originalElementFromPoint;

  expect(document.querySelector(".photos-drag-preview")).not.toBeInTheDocument();
  expect(
    firstImage.compareDocumentPosition(screen.getByAltText("Second image")) &
      Node.DOCUMENT_POSITION_PRECEDING,
  ).toBeTruthy();
  expect(fireEvent.click(firstImage.closest("a"), { detail: 1 })).toBe(false);
});

test("keeps the photo source link usable after a click without dragging", () => {
  render(<Photos photos={photos} />);
  const firstImage = screen.getByAltText("First image");
  firstImage.setPointerCapture = jest.fn();

  pointerEvent(firstImage, "pointerDown", [10, 10]);
  pointerEvent(firstImage, "pointerUp", [10, 10]);

  const link = firstImage.closest("a");
  expect(link).toHaveAttribute("href", photos[0].url);
  expect(fireEvent.click(link, { detail: 1 })).toBe(true);
});

test("does not reorder when a drag ends outside the gallery", () => {
  const originalElementFromPoint = document.elementFromPoint;
  document.elementFromPoint = jest.fn(() => null);
  render(<Photos photos={photos} />);
  const firstImage = screen.getByAltText("First image");
  firstImage.setPointerCapture = jest.fn();

  pointerEvent(firstImage, "pointerDown", [10, 10]);
  pointerEvent(firstImage, "pointerMove", [100, 100]);
  pointerEvent(firstImage, "pointerUp", [100, 100]);
  document.elementFromPoint = originalElementFromPoint;

  expect(
    firstImage.compareDocumentPosition(screen.getByAltText("Second image")) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

test("still supports dragging the drag button", () => {
  const originalElementFromPoint = document.elementFromPoint;
  document.elementFromPoint = jest.fn(() =>
    document.querySelector('[data-photo-index="1"]'),
  );
  render(<Photos photos={photos} />);
  const button = screen.getByRole("button", { name: /drag to move first image/i });
  button.setPointerCapture = jest.fn();

  pointerEvent(button, "pointerDown", [10, 10]);
  pointerEvent(button, "pointerMove", [100, 100]);
  pointerEvent(button, "pointerUp", [100, 100]);
  document.elementFromPoint = originalElementFromPoint;

  expect(
    screen.getByAltText("First image").compareDocumentPosition(
      screen.getByAltText("Second image"),
    ) & Node.DOCUMENT_POSITION_PRECEDING,
  ).toBeTruthy();
});

test("reorders photos using the touch-friendly move controls", () => {
  render(<Photos photos={photos} />);

  fireEvent.click(
    screen.getByRole("button", { name: /move first image later/i }),
  );

  expect(
    screen.getByAltText("First image").compareDocumentPosition(
      screen.getByAltText("Second image"),
    ) & Node.DOCUMENT_POSITION_PRECEDING,
  ).toBeTruthy();
});
