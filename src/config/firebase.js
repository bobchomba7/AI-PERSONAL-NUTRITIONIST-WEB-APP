import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { 
  doc, 
  getFirestore, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  increment 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage"; 
import { getPerformance } from "firebase/performance"; 
import { toast } from "react-toastify";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBHu7yK654XvPTink-3Kz-JyFRhCzkQ-HM",
  authDomain: "ai-nutritionist-e3ba0.firebaseapp.com",
  projectId: "ai-nutritionist-e3ba0",
  storageBucket: "ai-nutritionist-e3ba0.firebasestorage.app",
  messagingSenderId: "364790767134",
  appId: "1:364790767134:web:adcf054cf566bd41ddd80f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  
const storage = getStorage(app); 
const performance = getPerformance(app);
const analytics = getAnalytics(app);

// Signup Function
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username,
      email,
      name: username,
      stats: { logins: 0 } // Initialize login count
    });

    await setDoc(doc(db, "chats", user.uid), { chatData: [] });

    toast.success("Account created successfully!");
    return user;
  } catch (error) {
    console.error("Signup Error Code:", error.code);
    console.error("Signup Error Message:", error.message);
    
    // Provide specific feedback based on Firebase error codes
    let errorMessage = "Failed to create an account. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This email is already in use.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password should be at least 6 characters.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email format.";
    } else if (error.code === 'auth/permission-denied') {
      errorMessage = "Database permission denied. Check Firestore rules.";
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

// Login Function
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firestore login count
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      "stats.logins": increment(1),
    });

    toast.success("Login successful!");
    return userCredential;
  } catch (error) {
    console.error("Login Error Code:", error.code);
    console.error("Login Error Message:", error.message);

    let errorMessage = "Login failed. Please check your credentials.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid email or password.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "Too many failed attempts. Please try again later.";
    }

    toast.error(errorMessage);
    throw error;
  }
};

// Upload Image Function
const uploadImage = async (userId, imageFile) => {
  try {
    const imageRef = ref(storage, `images/${userId}/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Save Chat Function
const saveChat = async (userId, chat) => {
  const userDocRef = doc(db, "chats", userId);
  await updateDoc(userDocRef, {
    chatData: arrayUnion(chat)
  });
};

// Get Chats Function
const getChats = async (userId) => {
  const userDocRef = doc(db, "chats", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data().chatData;
  } else {
    return [];
  }
};

export { auth, db, signup, login, saveChat, getChats, uploadImage };
