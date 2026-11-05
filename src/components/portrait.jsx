import about from "../json/about.json";

// Any photo fits: the frame keeps its aspect ratio (CSS), the image covers it, and
// about.json `photo.focal` ("x% y%") picks which part of the photo stays in view.
function Portrait({ className = "" }) {
  const { src, alt, width, height, focal = "50% 50%" } = about.photo;
  return (
    <div className={`portrait ${className}`.trim()}>
      <img src={src} alt={alt} width={width} height={height} style={{ objectPosition: focal }} fetchpriority="high" />
    </div>
  );
}

export default Portrait;
