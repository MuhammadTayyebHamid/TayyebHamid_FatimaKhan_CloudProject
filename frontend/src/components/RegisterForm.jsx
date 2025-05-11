import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      // Auth context will handle the error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {authError && <div className="auth-error">{authError}</div>}

      <div className="form-group">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`form-input ${errors.username ? 'input-error' : ''}`}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-input ${errors.email ? 'input-error' : ''}`}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`form-input ${errors.password ? 'input-error' : ''}`}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <button type="submit" className="auth-button">Register</button>
    </form>
  );
};

export default RegisterForm;