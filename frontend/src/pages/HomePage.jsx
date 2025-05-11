import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/posts';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Recent Posts</h1>
        {isAuthenticated && (
          <Link to="/posts/create" className="create-post-btn">
            Create New Post
          </Link>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {!loading && posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found. Be the first to create a post!</p>
          {isAuthenticated ? (
            <Link to="/posts/create" className="create-post-btn">
              Create New Post
            </Link>
          ) : (
            <Link to="/login" className="login-btn">
              Login to create a post
            </Link>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;