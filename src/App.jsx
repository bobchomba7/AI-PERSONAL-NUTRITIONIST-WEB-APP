import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <Main />
      </div>
    </>
  );
};

export default App;
