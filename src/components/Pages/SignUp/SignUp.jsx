import React, { useState } from "react";
import "./SignUp.css";
import { signup } from "../../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Use react-toastify

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await signup(username, email, password);
      // Success toast is handled inside firebase.js
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="signup-container auth-page">
      <div className="auth-background"></div>
      <div className="form-wrapper glass-effect">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join Nutri-AI and start eating better</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>USERNAME</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>PASSWORD</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button className="auth-button" type="button" onClick={handleSignUp}>
            Sign Up
          </button>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
