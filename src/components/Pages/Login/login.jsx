import React, { useState, useContext, useEffect } from 'react';
import './login.css'; 
import { useNavigate } from 'react-router-dom';
import { login } from '../../../config/firebase';
import { Context } from '../../../context/Context';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context); // Access user from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for client-side error messages

  // Redirect to /main if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/main');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    // Reset error message
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      await login(email, password);
      // Since login now throws errors on failure, if we reach here, login was successful
      // The useEffect above will handle navigation once the user state updates in Context
    } catch (err) {
      // Error is already handled in firebase.js with toast notifications
      // We can set a generic error message here if needed, but toast handles most cases
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Login to account</h2>
        {error && <p className="error-message">{error}</p>} {/* Display client-side errors */}
        <form>
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" onClick={handleLogin}>Log In</button>
        </form>
        <p>
          don't have account? <a href="/SignUp">SIGN UP</a>
        </p>
      </div>
    </div>
  );
};

export default Login;