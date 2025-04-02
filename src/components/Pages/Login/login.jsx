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

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/Dashboard"), 2000);
    } catch (err) {
      console.error("Login Error:", err); // Debugging
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <h2>Login to Account</h2>
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
          <button type="button" onClick={handleLogin}>
            Log In
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">SIGN UP</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
