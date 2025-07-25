import React, { useState, useRef } from 'react';
import ImageCropper from './ImageCropper';
import getCroppedImage from './cropUtils';
import axios from 'axios';
import "../user-styles/BannerImageUpload.css";

const BannerImageUpload = ({ currentBannerImage, onImageUploaded }) => {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const handleCropComplete = async (croppedAreaPixels, rotation) => {
    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImage(imageToCrop, croppedAreaPixels, rotation);

      const formData = new FormData();
      formData.append('image', croppedBlob, 'banner.jpeg');
      formData.append('type', 'bannerImage');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const res = await axios.put("http://localhost:5000/api/user/update-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data.user;
      const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));
      if (onImageUploaded) onImageUploaded(updatedUser);

      alert('Banner image updated successfully!');
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to update banner image.");
    } finally {
      setIsUploading(false);
      setShowCropper(false);
      setImageToCrop(null);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  return (
    <div className="banner-upload-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="banner-upload-button" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Banner Image'}
      </button>

      {currentBannerImage?.startsWith('http') && (
        <img
          src={currentBannerImage}
          alt="Banner"
          className="banner-upload-preview"
        />
      )}

      {showCropper && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
          cropShape="rect"
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
};

export default BannerImageUpload;




