import { useRef, useState } from "react";

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ images, onChange }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const addFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE);
    const remainingSlots = MAX_IMAGES - images.length;

    if (validFiles.length !== files.length) {
      setError("Use image files smaller than 5 MB.");
    } else if (validFiles.length > remainingSlots) {
      setError(`You can upload up to ${MAX_IMAGES} photos.`);
    } else {
      setError("");
    }

    onChange([
      ...images,
      ...validFiles.slice(0, Math.max(remainingSlots, 0)).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (index) => {
    const image = images[index];
    if (image.preview) URL.revokeObjectURL(image.preview);
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="image-uploader">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        className="upload-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        Drag & drop images here, or click to upload — first image becomes the cover photo
      </button>
      {error && <p className="field-error">{error}</p>}
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div className="image-preview" key={image.publicId || image.preview}>
              <img src={image.url || image.preview} alt={`Listing preview ${index + 1}`} />
              {index === 0 && <span>Cover</span>}
              <button type="button" aria-label={`Remove image ${index + 1}`} onClick={() => removeImage(index)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
