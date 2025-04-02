import React, { useEffect, useState } from "react";
import { auth, db, uploadImage } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageFile) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const downloadURL = await uploadImage(user.uid, imageFile);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profilePicture: downloadURL });

      navigate("/main");
    } catch (error) {
      console.error("Error saving profile picture:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <label htmlFor="imageUpload" className="profile-picture-label">
          <img 
            src={image || userData?.profilePicture || "/default-profile.png"} 
            alt="Profile" 
            className="profile-picture" 
          />
        </label>
        <input 
          type="file" 
          id="imageUpload" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="file-input"
        />
        <p className="profile-name"><strong>{userData?.username}</strong></p>
        <p className="profile-email">{userData?.email}</p>

        <div className="form-group">
          <label>First Name</label>
          <input type="text" defaultValue={userData?.firstName} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" defaultValue={userData?.lastName} />
        </div>
        <div className="form-group">
          <label>Current Weight</label>
          <input type="text" defaultValue={userData?.currentWeight} />
        </div>
        <div className="form-group">
          <label>Starting Weight</label>
          <input type="text" defaultValue={userData?.startingWeight} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" defaultValue={userData?.email} disabled />
        </div>
        
        <button onClick={handleSave} className="save-button">Save</button>
      </div>
    </div>
  );
};

export default Profile;