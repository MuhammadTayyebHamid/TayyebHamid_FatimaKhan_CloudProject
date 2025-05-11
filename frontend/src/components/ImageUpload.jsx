import { useState } from 'react';
import { uploadImage } from '../services/uploads';

const ImageUpload = ({ onImageUploaded, initialImage = '' }) => {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
      onImageUploaded(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-upload">
      <div className="preview-container">
        {image ? (
          <img src={image} alt="Preview" className="image-preview" />
        ) : (
          <div className="upload-placeholder">
            <span>Upload Image</span>
          </div>
        )}
        {loading && <div className="loading-overlay">Uploading...</div>}
      </div>

      <div className="controls">
        <label className="upload-button">
          {image ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            disabled={loading}
          />
        </label>

        {image && (
          <button
            type="button"
            className="remove-button"
            onClick={() => {
              setImage('');
              onImageUploaded('');
            }}
          >
            Remove
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ImageUpload;