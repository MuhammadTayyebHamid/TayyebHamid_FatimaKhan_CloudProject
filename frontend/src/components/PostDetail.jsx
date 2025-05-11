import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostDetail = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && post.user_id === user.id;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="post-detail">
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="post-image"
        />
      )}
      
      <h1 className="post-title">{post.title}</h1>
      
      <div className="post-meta">
        <div className="post-author">
          {post.profile_image_url ? (
            <img 
              src={post.profile_image_url} 
              alt={post.username} 
              className="author-avatar"
            />
          ) : (
            <div className="author-initial">
              {post.username ? post.username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="author-name">{post.username}</span>
        </div>
        
        <div className="post-date">
          Published on {formatDate(post.created_at)}
          {post.created_at !== post.updated_at && 
            ` (Updated: ${formatDate(post.updated_at)})`}
        </div>
      </div>

      {isAuthor && (
        <div className="post-actions">
          <Link to={`/posts/${post.id}/edit`} className="edit-button">
            Edit Post
          </Link>
          <button 
            onClick={() => onDelete(post.id)} 
            className="delete-button"
          >
            Delete Post
          </button>
        </div>
      )}
      
      <div className="post-content">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </div>
  );
};

export default PostDetail;