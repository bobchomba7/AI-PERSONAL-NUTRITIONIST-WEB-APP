# 🍎 NUTRI-AI: Your Personal AI Nutritionist



**NUTRI-AI** is a state-of-the-art AI-powered web application designed to revolutionize how individuals manage their health and nutrition. Developed with a focus on precision, personalization, and a premium user experience, NUTRI-AI leverages the power of Google's Gemini Pro Vision to provide science-backed nutritional advice and real-time meal analysis.

---

## 🌟 Key Features

### 🧠 Intelligent AI Chat (Gemini Pro)
Engage with a highly capable AI assistant that understands complex dietary requirements. Whether you're looking for a vegan keto meal plan or need to understand the glycemic index of your favorite fruits, NUTRI-AI provides instant, tailored responses.

### 📸 AI Vision Analysis
Simply upload a photo of your meal! Our platform uses advanced computer vision to:
- Identify food items in the image.
- Estimate caloric content.
- Provide a breakdown of macronutrients (Proteins, Carbs, Fats).
- Offer suggestions for healthier alternatives.

### 📊 Dynamic Health Dashboard
Track your progress with elegance.
- **Interactive Charts:** Visualize weight fluctuations and caloric intake over time.
- **Activity Tracking:** Monitor your daily habits and see how they align with your health goals.
- **Usage Statistics:** Keep track of your AI interactions and growth benchmarks.

### 🌙 Premium User Interface
- **Glassmorphic Design:** A modern, sleek aesthetic that feels like a native app.
- **Adaptive Dark Mode:** Seamlessly switch between Light and Dark themes for comfortable viewing in any environment.
- **Mobile First:** Fully responsive across all devices—desktops, tablets, and smartphones.

### 🔒 Secure & Personalized
- **Firebase Authentication:** Robust and secure login/signup system.
- **Encrypted Data Storage:** Your health data and chat history are securely stored in Google Cloud Firestore.
- **Profile Customization:** Tailored advice based on your unique user profile.

---

## 🚀 Tech Stack

- **Frontend:** [React.js](https://reactjs.org/) (v19) & [Vite](https://vitejs.dev/)
- **State Management:** React Context API
- **AI Engine:** [Google Generative AI](https://ai.google.dev/) (Gemini Pro & Vision)
- **Backend/Database:** [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **Visualizations:** [Chart.js](https://www.chartjs.org/)
- **Styling:** Vanilla CSS (Modern CSS3 with Variables)
- **Routing:** [React Router DOM](https://reactrouter.com/) (v7)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- A [Google AI Studio](https://aistudio.google.com/) API Key
- A [Firebase Project](https://console.firebase.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI-PERSONAL-NUTRITIONIST-WEB-APP.git
cd AI-PERSONAL-NUTRITIONIST-WEB-APP
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Firebase Configuration
Update `src/config/firebase.js` with your Firebase project credentials.

### 5. Run the Application
```bash
# Start the development server
npm run dev
```

---

## 🗺️ Future Roadmap
- [ ] **Wearable Integration:** Sync with Apple Health and Google Fit.
- [ ] **Barcode Scanning:** Scan product labels for instant nutritional facts.
- [ ] **Community Challenges:** Gamified health goals with friends.
- [ ] **Voice Commands:** Hands-free meal logging using AI voice recognition.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---

Designed with ❤️ for a healthier world.
