import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App= () => {
  return (
    <>
      <ToastContainer/>
      <Sidebar/>
      <Main/>


    </>
  )
}

export default App