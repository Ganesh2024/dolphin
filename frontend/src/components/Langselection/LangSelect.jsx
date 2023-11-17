import React from "react";
import { useState } from "react";
import { BsArrowRight } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
import './LangSelect.css'
import axios from "axios";

const LangSelection = () => {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [lang,setLang] = useState('Eng');
  const url = 'https://dolphinapi.onrender.com';

  const HandleLangChange = async (e) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : null;
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
        'mode': 'no-cors',
      }
      if (userData== null) { alert(`Can't find user , Please login again`); return }
      setLoading(true)
      const res = await axios.post(url + "/langSelect",{lang, userId:userData._id}, headers);
      console.log(res);
      localStorage.setItem("selectedLang",JSON.stringify(lang))
      setLoading(false)
      navigate('/main');
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  return (
    <div className="langPageWrapper">

      <div className="langP-header">
        <h3>Hey Mula!</h3>
        <p>Choose your language you want to <span style={{ "color": "#E15554" }}>Learn!</span></p>
      </div>

      <div className="selectLangWrapper">
        <h1>Dolphin!</h1>
        <div className="select">
          <select onChange={(e)=>setLang(e.target.value)}>
            <option value="Eng">English</option>
            <option value="Hindi">Hindi</option>
          </select> 
        </div>
        <button disabled={loading} onClick={HandleLangChange} className="btn-continue"> {loading?"Updating...":"Continue"} {<BsArrowRight />} </button>
      </div>
    </div>
  );
}

export default LangSelection;