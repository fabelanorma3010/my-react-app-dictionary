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
                <img
                  src={imageUrl}
                  className="img-fluid"
                  alt={photo.alt || "Related to the searched word"}
                />
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
