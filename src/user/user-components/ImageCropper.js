import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import '../user-styles/ImageCropper.css';

const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  cropShape = 'round',
  aspectRatio = 1,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((newCrop) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((value) => {
    setZoom(Math.min(Math.max(1, value), 3)); // Clamp between 1 and 3
  }, []);

  const onRotationChange = useCallback((value) => {
    setRotation(value);
  }, []);

  const onCropAreaChange = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDoneClick = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels, rotation);
    }
  };

  return (
    <div className="image-cropper-modal">
      <div className="cropper-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          onCropComplete={onCropAreaChange}
          cropShape={cropShape}
          showGrid={true}
          restrictPosition={false}
        />
      </div>

      <div className="controls">
        <label htmlFor="zoom-slider">Zoom:</label>
        <input
          id="zoom-slider"
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-label="Zoom"
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
          className="zoom-slider"
        />
        {/* Optional Rotation */}
        {/* <label htmlFor="rotation-slider">Rotation:</label>
        <input
          id="rotation-slider"
          type="range"
          value={rotation}
          min={0}
          max={360}
          step={1}
          aria-label="Rotation"
          onChange={(e) => onRotationChange(parseFloat(e.target.value))}
          className="rotation-slider"
        /> */}
      </div>

      <div className="actions">
        <button onClick={onCancel} className="cancel-btn" aria-label="Cancel cropping">Cancel</button>
        <button onClick={handleDoneClick} className="done-btn" aria-label="Confirm cropping">Done</button>
      </div>
    </div>
  );
};

export default ImageCropper;

