import { useState } from "react";
import about from "../json/about.json";

// The whole photo, never cropped. The frame takes the photo's own aspect ratio: first
// from about.json `photo.width/height` (so the space is reserved before it loads), then
// from the real file once it loads, in case a replacement photo has a different shape.
// `object-fit: contain` is the backstop, so even a wrong ratio letterboxes, never cuts.
function Portrait({ className = "" }) {
  const { src, alt, width, height } = about.photo;
  const [ratio, setRatio] = useState(`${width} / ${height}`);
  const onLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    if (w && h) setRatio(`${w} / ${h}`);
  };
  return (
    <div className={`portrait ${className}`.trim()} style={{ "--ratio": ratio }}>
      <img src={src} alt={alt} width={width} height={height} onLoad={onLoad} fetchpriority="high" />
    </div>
  );
}

export default Portrait;
