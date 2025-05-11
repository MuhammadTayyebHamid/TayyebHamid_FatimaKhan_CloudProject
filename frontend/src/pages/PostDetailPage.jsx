import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../services/posts';
import PostDetail from '../components/PostDetail';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPost(id);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Could not load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setLoading(true);
        await deletePost(postId);
        navigate('/');
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Could not delete the post. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="not-found">Post not found</div>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="navigation">
        <Link to="/" className="back-link">← Back to Posts</Link>
      </div>
      
      <PostDetail 
        post={post} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default PostDetailPage;