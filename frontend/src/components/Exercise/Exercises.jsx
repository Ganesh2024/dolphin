import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import { RiLogoutCircleLine } from "react-icons/ri";

import axios from "axios";

import "./Exercises.css"

const Exercises = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false);
  const [mcq_progress, setMcqProgress] = useState(0)
  const [Fillup_progress, setFillupProgress] = useState(0)
  const url = 'https://dolphinapi.onrender.com';
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
    'mode': 'no-cors',
  }
  
  const getUsername = () => {
    const email = userData.email;
    const username = email.split('@')[0];
    setUsername(username);
  }

  const getUser = async () => {
    console.log('getuser');
    const { data } = await axios.post(url + "/user", { userId: userData._id }, headers);
    const corr_ques_arr = data.user.lang[0].correctQues;
    const wrong_ques_arr = data.user.lang[0].wrongQues;
    var attmp_mcq = 0;
    var attmp_Fillup = 0;
    corr_ques_arr.forEach(element => {
      if(element.type=="mcq") attmp_mcq++;
      else{attmp_Fillup++}
    });
    wrong_ques_arr.forEach(element => {
      if(element.type=="mcq") attmp_mcq++;
      else{attmp_Fillup++}
    });
    var mcq_prgrs = ((attmp_mcq/30)*100).toFixed(1)
    var Fillup_prgrs = ((attmp_Fillup/30)*100).toFixed(1)
    setMcqProgress(mcq_prgrs)
    setFillupProgress(Fillup_prgrs)
  }

  useEffect(() => {
    getUsername();
    getUser();
  }, [username])


  const handleExercise = (e) => {
    var exercise = e.target.childNodes[0];
    if (exercise.innerText == "Exercise 1") localStorage.setItem("exercise", JSON.stringify("mcq"));
    if (exercise.innerText == "Exercise 2") localStorage.setItem("exercise", JSON.stringify("Fillup"));
    navigate('/question')
  }
  
  const handleReset = async () => {
    const data = await axios.post(url+'/reset',{userId:userData._id},headers);
    localStorage.removeItem("mcq-index")
    localStorage.removeItem("Fillup-index")
    console.log(data);
    navigate('/langSelect')
  }
  const handleLogout = async () => {
    localStorage.removeItem("exercise")
    localStorage.removeItem("userData");
    navigate('/login')
  }

  // const langs = document.querySelectorAll('.lang');
  // langs.forEach(item=>{
  //   console.log(item.value);
  // })

  return (
    <div className='exercisesPage-wrapper'>
      <div className='exercises-header'>
        <div className="user-img">
          <FaCircleUser />
        </div>
        <div className="user-info">
          <h1>Hi, {username}</h1>
          <p>All your <span style={{ color: "#E15554" }}>progress</span> for {localStorage.getItem("selectedLang")?JSON.parse(localStorage.getItem("selectedLang")):""} in one place</p>
        </div>
        <div className="rst-logout-wrp">
          <div onClick={handleReset} className='reset'>reset</div>
          <div onClick={handleLogout} className='logout'><RiLogoutCircleLine /></div>
        </div>
      </div>
      <div className='exercises-wrapper'>
        <div className="change_lang">
          <h2>Languages</h2>
          <div className="lang-wrp">
            <div className="lang" value="Eng">English</div>
            <div className="lang" value="Hindi">Hindi</div>
          </div>
        </div>
        <h1>Choose Exercise</h1>
        <div className='exercises'>
          <div onClick={handleExercise} className='exercise'>
            <p>Exercise 1</p>
            <p className='progress'>{mcq_progress}%</p>
          </div>
          <div onClick={handleExercise} className='exercise'>
            <p>Exercise 2</p>
            <p className='progress'>{Fillup_progress}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exercises;