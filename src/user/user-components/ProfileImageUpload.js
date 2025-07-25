import React, { useState, useRef } from 'react';
import ImageCropper from './ImageCropper';
import getCroppedImage from './cropUtils';
import axios from 'axios';
import "../user-styles/ProfileImageUpload.css";


const ProfileImageUpload = ({ currentProfilePic, onImageUploaded }) => {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
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
    event.target.value = ''; // Clear input
  };

  const handleCropComplete = async (croppedAreaPixels, rotation) => {
    try {
      const croppedBlob = await getCroppedImage(imageToCrop, croppedAreaPixels, rotation);

      const formData = new FormData();
      formData.append('image', croppedBlob, 'profile.jpg');
      formData.append('type', 'profilePic');

      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');

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
      alert('Profile image updated successfully!');
    } catch (e) {
      console.error("Upload failed:", e);
      alert("Failed to update profile image.");
    } finally {
      setShowCropper(false);
      setImageToCrop(null);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    console.log("User cancelled cropping");
  };

  return (
    <div className="profile-upload-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="profile-upload-button" onClick={() => fileInputRef.current.click()} aria-label="Upload Profile Image">
        Upload Profile Image
      </button>

      {currentProfilePic && typeof currentProfilePic === 'string' && (
        <img
          src={currentProfilePic}
          alt="Profile"
          className="profile-upload-preview"
        />
      )}

      {showCropper && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
          cropShape="round"
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default ProfileImageUpload;





