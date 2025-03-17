import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page">
            <div className="content">
                <h1>NUTRI-AI</h1>
                <h2>Healthy living suited for you!</h2>
                <p>Our AI-powered nutritionist analyzes your goals, dietary preferences, and lifestyle to create personalized meal plans and recommendations. Ready to start your journey to better health? Let’s get to know you!</p>
                <button className="get-started-button" onClick={handleGetStarted}>Get Started</button>
            </div>
            <div className="image-section">
                <img src="\landing.jpg" alt="Healthy Food" />
            </div>
        </div>
    );
};

export default LandingPage;
