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
        if (!user) {
          console.log("No user is logged in");
          return;
        }

        console.log("Fetching data for user:", user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          console.log("User data:", data);
          setUserData(data);

          // Extract stats correctly
          setLoginCount(data.stats?.logins || 0);
          setChatCount(data.stats?.chatInteractions || 0);
          setImageUploads(data.stats?.imagesUploaded || 0);
        } else {
          console.log("No such document found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Chart Data Configuration
  const chartData = {
    labels: ["Logins", "Chats", "Image Uploads"],
    datasets: [
      {
        label: "User Activity",
        data: [loginCount, chatCount, imageUploads],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
        borderColor: ["#388E3C", "#1976D2", "#F57C00"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar2">
        <h2>DASHBOARD</h2>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <h1>Welcome, {userData?.username || "User"}!</h1>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="dashboard-card">
            <h3>Login Activity</h3>
            <p>{loginCount}</p>
          </div>
          <div className="dashboard-card">
            <h3>Number of Chats</h3>
            <p>{chatCount}</p>
          </div>
          <div className="dashboard-card">
            <h3>Number of Image Uploads</h3>
            <p>{imageUploads}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="dashboard-chart">
          <h2>User Activity Overview</h2>
          <Bar data={chartData} />
        </div>

        {/* Navigation Button */}
        <button className="dashboard-button" onClick={() => window.location.href = "/main"}>
          GO TO MAIN PAGE
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
