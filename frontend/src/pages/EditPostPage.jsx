import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../services/posts';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';

const EditPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
        
        // Check if user is author
        if (user && data.user_id !== user.id) {
          setError('You are not authorized to edit this post');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (postData) => {
    try {
      await updatePost(id, postData);
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>
      
      <PostForm 
        initialData={post} 
        onSubmit={handleSubmit} 
        buttonText="Update Post" 
      />
    </div>
  );
};

export default EditPostPage;