import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="post-image"
        />
      )}
      <div className="post-content">
        <h3 className="post-title">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="post-excerpt">
          {post.content.length > 150 
            ? `${post.content.substring(0, 150)}...` 
            : post.content}
        </p>
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
            <span>{post.username}</span>
          </div>
          <div className="post-date">{formatDate(post.created_at)}</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;