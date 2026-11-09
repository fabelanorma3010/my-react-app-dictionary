import React, { useEffect, useRef, useState } from "react";

export default function Photos(props) {
  const [photos, setPhotos] = useState(props.photos || []);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    setPhotos(props.photos || []);
    setDraggingIndex(null);
    setDropTargetIndex(null);
    setDragPreview(null);
    dragRef.current = null;
    suppressClickRef.current = false;
  }, [props.photos]);

  function movePhoto(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= photos.length || fromIndex === toIndex) {
      return;
    }

    setPhotos((currentPhotos) => {
      const reorderedPhotos = [...currentPhotos];
      const [movedPhoto] = reorderedPhotos.splice(fromIndex, 1);
      reorderedPhotos.splice(toIndex, 0, movedPhoto);
      return reorderedPhotos;
    });
  }

  function handlePointerDown(index, event) {
    if (
      event.isPrimary === false ||
      (event.button !== undefined && event.button !== 0)
    ) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      fromIndex: index,
      toIndex: null,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  }

  function handlePointerMove(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const drag = dragRef.current;
    if (
      !drag.moved &&
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5
    ) {
      return;
    }

    drag.moved = true;
    setDraggingIndex(drag.fromIndex);
    const photo = photos[drag.fromIndex];
    setDragPreview({
      url: photo?.src?.landscape || photo?.src?.medium || photo?.url,
      x: event.clientX,
      y: event.clientY,
    });
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest("[data-photo-index]");
    const targetIndex = target ? Number(target.dataset.photoIndex) : null;
    drag.toIndex =
      targetIndex !== null && !Number.isNaN(targetIndex) ? targetIndex : null;
    setDropTargetIndex(drag.toIndex);
  }

  function finishPointerDrag(event, shouldMove) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const { fromIndex, toIndex, moved } = dragRef.current;
    dragRef.current = null;
    suppressClickRef.current = moved;
    setDraggingIndex(null);
    setDropTargetIndex(null);
    setDragPreview(null);
    if (shouldMove && moved && toIndex !== null) {
      movePhoto(fromIndex, toIndex);
    }
  }

  if (photos.length > 0) {
    return (
      <section className="Photos">
        <p className="photos-instructions">
          Drag a photo onto another photo, or use its arrows to rearrange.
        </p>
        <div className="row">
          {photos.map(function (photo, index) {
            const imageUrl =
              photo?.src?.landscape || photo?.src?.medium || photo?.url;
            if (!imageUrl) {
              return null;
            }

            return (
              <div
                className={[
                  "col-3",
                  draggingIndex === index ? "is-dragging" : "",
                  dropTargetIndex === index && draggingIndex !== index
                    ? "is-drop-target"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-photo-index={index}
                key={imageUrl}
              >
                <div className="photos-card">
                  <a
                    href={photo.pageUrl || imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="photos-link"
                    aria-label={`View ${photo.title || "image"} on Wikimedia Commons`}
                    draggable="false"
                    onClick={(event) => {
                      if (suppressClickRef.current && event.detail !== 0) {
                        event.preventDefault();
                      }
                      suppressClickRef.current = false;
                    }}
                  >
                    <img
                      src={imageUrl}
                      className="img-fluid photos-image"
                      alt={photo.title || "Related to the searched word"}
                      draggable="false"
                      onPointerDown={(event) => handlePointerDown(index, event)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={(event) => finishPointerDrag(event, true)}
                      onPointerCancel={(event) =>
                        finishPointerDrag(event, false)
                      }
                      onLostPointerCapture={(event) =>
                        finishPointerDrag(event, false)
                      }
                    />
                    <span className="photos-attribution">
                      {photo.title || "View image details and license"}
                    </span>
                  </a>
                  <div className="photos-move-controls">
                    <button
                      type="button"
                      className="photos-move-button"
                      aria-label={`Drag to move ${photo.title || "image"}`}
                      title="Drag to rearrange"
                      onPointerDown={(event) => handlePointerDown(index, event)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={(event) => finishPointerDrag(event, true)}
                      onPointerCancel={(event) =>
                        finishPointerDrag(event, false)
                      }
                      onLostPointerCapture={(event) =>
                        finishPointerDrag(event, false)
                      }
                      onKeyDown={(event) => {
                        const previousKeys = ["ArrowLeft", "ArrowUp"];
                        const nextKeys = ["ArrowRight", "ArrowDown"];
                        if (
                          !previousKeys.includes(event.key) &&
                          !nextKeys.includes(event.key)
                        ) {
                          return;
                        }
                        event.preventDefault();
                        movePhoto(
                          index,
                          index + (previousKeys.includes(event.key) ? -1 : 1),
                        );
                      }}
                    >
                      Drag
                    </button>
                    <button
                      type="button"
                      className="photos-step-button"
                      aria-label={`Move ${photo.title || "image"} earlier`}
                      title="Move earlier"
                      disabled={index === 0}
                      onClick={() => movePhoto(index, index - 1)}
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      className="photos-step-button"
                      aria-label={`Move ${photo.title || "image"} later`}
                      title="Move later"
                      disabled={index === photos.length - 1}
                      onClick={() => movePhoto(index, index + 1)}
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {dragPreview && (
          <img
            className="photos-drag-preview"
            src={dragPreview.url}
            alt=""
            aria-hidden="true"
            style={{ left: dragPreview.x, top: dragPreview.y }}
          />
        )}
      </section>
    );
  } else {
    return null;
  }
}
