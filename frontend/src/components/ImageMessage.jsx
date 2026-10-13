
export default function ImageMessage({
  src,
  alt = "Attached image",
  caption,
  onRemove,
  preview = false,
}) {
  if (!src) return null;

  return (
    <div className={`image-message ${preview ? "image-message-preview" : ""}`}>
      <img
        className="image-message-image"
        src={src}
        alt={alt}
        loading="lazy"
      />

      {caption && <p className="image-message-caption">{caption}</p>}

      {preview && onRemove && (
        <button
          type="button"
          className="image-message-remove"
          onClick={onRemove}
          aria-label="Remove attached image"
          title="Remove image"
        >
          ×
        </button>
      )}
    </div>
  );
}
