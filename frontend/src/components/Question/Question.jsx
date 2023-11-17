import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Question.css";

export const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [index, setIndex] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [disableNext, setDisableNext] = useState(true);

  const url = 'https://dolphinapi.onrender.com/';

  var exercise = localStorage.getItem("exercise") ? JSON.parse(localStorage.getItem("exercise")) : null;
  var lang = localStorage.getItem("selectedLang") ? JSON.parse(localStorage.getItem("selectedLang")) : null;
  var userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
  if (userData == null) { alert("user not found please login again"); return; }

  const getQuestions = async () => {
    try {
      const { data } = await axios.post(url + '/exercise', { lang, exercise });
      setQuestions(data.exerciseQuestions);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getQuestions();
    if (exercise == "mcq") setIndex(JSON.parse(localStorage.getItem("mcq-index")) + 1);
    else if (exercise == "Fillup") setIndex(JSON.parse(localStorage.getItem("Fillup-index")) + 1);
  }, [])


  const handleSubmit = async (e) => {
    if (selectedOpt == questions[index].corrAns) {
      setDisableSubmit(true);

      const options = document.querySelectorAll('.options');
      options.forEach((item, index) => {
        if (item.innerText == selectedOpt) {
          item.style.background = "green"
          item.style.color = "#fff"
        }
      })

      console.log('correct req');
      const res = await axios.post(url + '/quesId', { quesId: questions[index]._id, type: questions[index].exercise, lang, level: questions[index].level, userId: userData._id });
      
      setDisableNext(false);
      alert("Correct answer!");
    }
    else {
      const options = document.querySelectorAll('.options');
      options.forEach((item, index) => {
        if (item.innerText == selectedOpt) {
          item.style.background = "crimson"
          item.style.color = "#fff"
        }
      })
      setDisableSubmit(true)
      console.log('Incorrect req');
      const res = await axios.post(url + '/quesId', { quesId: questions[index]._id, type: questions[index].exercise, lang, level: 0, userId: userData._id });
      alert("your are wrong, answer is " + questions[index].corrAns);
      console.log(res);
      setDisableNext(false);
    }

  }

  const handleNext = () => {
    var x = index;
    setIndex(++x);
    if (exercise == "mcq") localStorage.setItem("mcq-index", JSON.stringify(index));
    if (exercise == "Fillup") localStorage.setItem("Fillup-index", JSON.stringify(index));
    setDisableSubmit(false);
    setDisableNext(true);

    const options = document.querySelectorAll('.options');
    options.forEach(item => {
      item.style.background = "#fff"
      item.style.color = "#333"
    })

  }

  const handleActive = (index) => {
    const options = document.querySelectorAll('.options');
    setSelectedOpt(options[index].innerText);
    options.forEach((item, idx) => {
      if (idx == index) {
        options[idx].style.background = "#333"
        options[idx].style.color = "#fff"
      }
      else {
        options[idx].style.background = "#fff"
        options[idx].style.color = "#000"
      }
    })
  }

  console.log(questions[index]?.level);

  return (
    <div className='Question-wrapper'>
      <div className='Question'>
        <div className="Question-header">
          <h1>Question {index}</h1>
          <div className="info">
            <div style={{background:`${questions[index]?.level==1?"green":questions[index]?.level==2?"orange":"crimson"}`}} className="level">{questions[index]?.level==1?"Easy":questions[index]?.level==2?"Medium":"Hard"}</div>
            <div className="point">{questions[index]?.level==1?1:questions[index]?.level==2?2:3} point</div>
          </div>
        </div>
        <div className='description'>
          <h3>{questions[index]?.desc}</h3>
          <p></p>
        </div>
        <div className='options-wrp'>
          <h3>Options</h3>
          <div className="form-control">
            {questions[index]?.options.map((item, index) => {
              return <div key={index} onClick={() => handleActive(index)} className="options">{item}</div>
            })}
            {/* <div onClick={handleActive} className="options">{questions[index]?.options[0]}</div>
            <div onClick={handleActive} className="options">{questions[index]?.options[1]}</div>
            <div onClick={handleActive} className="options">{questions[index]?.options[2]}</div>
            <div onClick={handleActive} className="options">{questions[index]?.options[3]}</div> */}
          </div>
        </div>
        <div className="buttons">
          <button disabled={disableSubmit} onClick={handleSubmit} className="submit-btn">Submit</button>
          <button disabled={disableNext} onClick={handleNext} className="next-btn">Next</button>
        </div>
      </div>
    </div>

  )
}
