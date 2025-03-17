import React, { useState } from 'react';
import './SignUp.css'; // Ensure this path is correct
import { SignUp } from '../../../config/firebase';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    await signup(username, email, password);
  };

  return (
    <div className="signup-container">
      <div className="form-wrapper">
        <h2>Sign Up</h2>
        <form>
          <div className="form-group">
            <label>USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <button type="button" onClick={handleSignUp}>Sign Up</button>
          <p>
          already have an account? <a href="/login">Login</a>
        </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;