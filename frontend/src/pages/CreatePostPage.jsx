import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/posts';
import PostForm from '../components/PostForm';

const CreatePostPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    try {
      const newPost = await createPost(postData);
      navigate(`/posts/${newPost.id}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="create-post-page">
      <h1>Create New Post</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <PostForm onSubmit={handleSubmit} buttonText="Create Post" />
    </div>
  );
};

export default CreatePostPage;