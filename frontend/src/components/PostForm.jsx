import { useState } from 'react';
import ImageUpload from './ImageUpload';

const PostForm = ({ initialData = {}, onSubmit, buttonText = 'Submit' }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [imageUrl, setImageUrl] = useState(initialData.featured_image_url || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        title,
        content,
        featured_image_url: imageUrl
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`form-input ${errors.title ? 'input-error' : ''}`}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="8"
          className={`form-textarea ${errors.content ? 'input-error' : ''}`}
        />
        {errors.content && <p className="error-text">{errors.content}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Featured Image</label>
        <ImageUpload
          onImageUploaded={setImageUrl}
          initialImage={imageUrl}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Submitting...' : buttonText}
      </button>
    </form>
  );
};

export default PostForm;