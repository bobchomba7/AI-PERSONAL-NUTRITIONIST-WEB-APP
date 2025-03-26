import React, { useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);

    // Update Firestore with new profile picture
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profilePicture: reader.result });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <img src={image || userData?.profilePicture || "/default-profile.png"} alt="Profile" className="profile-picture" />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <p><strong>Username:</strong> {userData?.username}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
