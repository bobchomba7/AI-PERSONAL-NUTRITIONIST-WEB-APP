import { useEffect, useState } from "react";
import { db, auth } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2"; 
import "chart.js/auto"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loginCount, setLoginCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [imageUploads, setImageUploads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);
          setLoginCount(data.stats?.logins || 0);
          setChatCount(data.stats?.chatInteractions || 0);
          setImageUploads(data.stats?.imagesUploaded || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const chartData = {
    labels: ["Activity Score", "Communication", "Visual Analysis"],
    datasets: [
      {
        label: "Your Performance",
        data: [loginCount, chatCount, imageUploads],
        backgroundColor: ["#004d40", "#80cbc4", "#a7d7c5"],
        borderRadius: 16,
        barThickness: 40,
        hoverBackgroundColor: "#00332c",
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#004d40',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true, color: 'rgba(0, 77, 64, 0.05)', drawBorder: false },
        ticks: { color: '#547d74', font: { size: 12, weight: '600' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#004d40', font: { size: 13, weight: '700' } }
      }
    },
  };

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container animate-fade-in">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Activity Dashboard</h1>
            <p>Welcome back, <span>{userData?.username || "User"}</span>! Here's your health progress.</p>
          </div>
          {/* Squeezed Button Fix: Bigger & Better fit */}
          <button className="back-btn" onClick={() => window.location.href = "/main"}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Go back to Chat</span>
          </button>
        </header>

        <main className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon logins">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
              </div>
              <div className="stat-info">
                <h3>Total Logins</h3>
                <p className="stat-value">{loginCount}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon chats">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className="stat-info">
                <h3>Chat Activity</h3>
                <p className="stat-value">{chatCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon uploads">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <div className="stat-info">
                <h3>Images Analyzed</h3>
                <p className="stat-value">{imageUploads}</p>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-header">
              <h2>Recent Activity Overview</h2>
              <p>Performance analysis across categories</p>
            </div>
            <div className="chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
