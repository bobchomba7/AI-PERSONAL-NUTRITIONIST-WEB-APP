import React, { useContext } from "react";
import './Main.css'
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {

    const{onSent,recentPrompt,showResult
        ,loading,resultData,setInput,input} = useContext(Context)
    return (
        <div className='main'>
            <div className="nav">
                <p>AI Nutritionist</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-conatiner">

               {!showResult
               ?<>
                <div className="greet">
                    <p><span>Hello bob</span></p>
                    <p>How can i help you today</p>
                    
                </div>
                <div className="cards">
                    <div className="card">
                        <p>Suggest healthy recipe</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="card">
                        <p>Suggest healthy diet</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="card">
                        <p>Suggest healthy meal plan</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="card">
                        <p>Suggest healthy drinks</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                </div>


               </>
               :<div className="result">
                    <div className="result-title">
                        <img src={assets.user_icon} alt=""  />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.gemini_icon}alt=""  />
                        {loading
                        ?<div className="loader">
                            <hr />
                            <hr />
                        
                        </div>
                        :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
                        }
                        
                    </div>
               </div>
               } 
               

                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Enter question here" />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            {input?<img onClick={()=>onSent()}src={assets.send_icon} alt=""/>:null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        This information is for consultation purposes only
                    </p>
                </div>


            </div>

        </div>
    )
}

export default Main;