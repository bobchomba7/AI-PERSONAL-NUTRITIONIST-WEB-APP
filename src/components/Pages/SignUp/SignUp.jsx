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
      toast.success("Signup complete! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Signup Error:", error); // Debugging
      toast.error("Signup failed. Please try again.");
    }
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
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
