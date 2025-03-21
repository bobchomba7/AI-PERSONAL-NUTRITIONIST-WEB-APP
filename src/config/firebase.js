import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Add Storage imports
import { toast } from "react-toastify";

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
const storage = getStorage(app); // Initialize Storage

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username,
      email,
      name: username
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatData: []
    });
    toast.success("Account created successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to create an account");
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to log in");
  }
};

// Function to upload image to Firebase Storage and return the download URL
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

const saveChat = async (userId, chat) => {
  const userDocRef = doc(db, "chats", userId);
  await updateDoc(userDocRef, {
    chatData: arrayUnion(chat)
  });
};

const getChats = async (userId) => {
  const userDocRef = doc(db, "chats", userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    return userDocSnap.data().chatData;
  } else {
    return [];
  }
};

export { signup, login, saveChat, getChats, uploadImage };