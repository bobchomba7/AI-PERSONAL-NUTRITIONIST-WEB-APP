import React, { useState, useContext, useEffect } from "react";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../config/firebase";
import { Context } from "../../../context/Context";
import { db } from "../../../config/firebase";
import { updateDoc, doc, increment } from "firebase/firestore";
import { toast } from "react-toastify"; // Use react-toastify

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/Dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    try {
      const userCredential = await login(email, password);
      const loggedInUser = userCredential.user;

      // Update Firestore login count
      const userRef = doc(db, "users", loggedInUser.uid);
      await updateDoc(userRef, {
        "stats.logins": increment(1),
      });

      setTimeout(() => navigate("/Dashboard"), 2000);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="login-container auth-page">
      <div className="auth-background"></div>
      <div className="form-wrapper glass-effect">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to continue your health journey</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
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
          <button className="auth-button" type="button" onClick={handleLogin}>
            Log In
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
