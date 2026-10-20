import React from "react";

export default function Photos(props) {
  if (Array.isArray(props.photos) && props.photos.length > 0) {
    return (
      <section className="Photos">
        <div className="row">
          {props.photos.map(function (photo, index) {
            const imageUrl =
              photo?.src?.landscape || photo?.src?.medium || photo?.url;
            if (!imageUrl) {
              return null;
            }

            return (
              <div className="col-3" key={index}>
                <a
                  href={photo.pageUrl || imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="photos-link"
                  aria-label={`View ${photo.title || "image"} on Wikimedia Commons`}
                >
                  <img
                    src={imageUrl}
                    className="img-fluid photos-image"
                    alt={photo.title || "Related to the searched word"}
                  />
                  <span className="photos-attribution">
                    {photo.title || "View image details and license"}
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </section>
    );
  } else {
    return null;
  }
}
