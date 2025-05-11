import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">BlogApp</Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/posts/create" className="nav-link">New Post</Link>
              <div className="user-menu">
                <span className="username">
                  {user?.profile_image_url && (
                    <img 
                      src={user.profile_image_url} 
                      alt={user.username} 
                      className="avatar"
                    />
                  )}
                  {user?.username}
                </span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;