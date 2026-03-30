import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="landing-page-container">
            <div className="landing-page">
                <nav className="landing-nav">
                <div className="landing-logo">NUTRI-AI</div>
                <button className="nav-cta" onClick={handleGetStarted}>Login</button>
            </nav>

            <main className="content">
                <h1>Wellness <span>Made Simple.</span></h1>
                <p className="sub-header">Experience the next generation of AI-powered nutrition. Personalized, science-backed, and tailored just for you.</p>
                <div className="cta-buttons">
                    <button className="get-started-button" onClick={handleGetStarted}>
                        Join Nutri-AI
                    </button>
                    <a href="#whats-new" className="secondary-button">See what's new &rarr;</a>
                </div>

                    <div className="image-section">
                        <img src="/landing.jpg" alt="Nutri-AI Visualization" className="hero-image" />
                    </div>
                </main>
            </div>

            {/* What's New Section */}
            <section id="whats-new" className="whats-new">
                <div className="section-header">
                    <h2>What's New in <span>NUTRI-AI</span></h2>
                    <p>Discover the latest tools to accelerate your health journey.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-content">
                            <h3>AI Vision Analysis</h3>
                            <p>Upload a photo of your meal and our AI instantly calculates calories and nutritional value.</p>
                        </div>
                        <div className="feature-mockup">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" alt="Vision Analysis" />
                        </div>
                    </div>

                    <div className="feature-card reverse">
                        <div className="feature-content">
                            <h3>Dynamic Meal Planning</h3>
                            <p>Get a 7-day plan that adapts to your cravings while staying within your health goals.</p>
                        </div>
                        <div className="feature-mockup">
                            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80" alt="Meal Planning" />
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-content">
                            <h3>Real-time Tracking</h3>
                            <p>See your progress in beautiful, interactive charts that track your weight and activity.</p>
                        </div>
                        <div className="feature-mockup">
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" alt="Tracking" />
                        </div>
                    </div>
                </div>
                
                <div className="section-footer">
                    <button className="get-started-button" onClick={handleGetStarted}>Start Your Journey Now</button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
