import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css' 


export const Login = () => {
  const url = 'https://dolphinapi.onrender.com/';
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    try {
      e.preventDefault();
      const Data = new FormData(e.currentTarget);
      const userData = {
          email: Data.get('email'),
          password: Data.get('password'),
      };
      if(userData.email=='' || userData.password==''){alert('all inputs are required');return}
      const  headers = {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json',
          'mode': 'no-cors',
      }
      setLoading(true);
      const {data} = await axios.post(url+'/login',userData,headers);
      console.log(data);
      setLoading(false);
      if(data.status==200){
        localStorage.setItem("userData",JSON.stringify({email:data.user.email,_id:data.user._id}));
        navigate('/langSelect');
        return
      }
      alert(data.msg);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };


  return (
    <div className="login-wrp">
      <div className="header">
        <h3>Hey, you’re back!</h3>
        <p>
          Let's become a Language{" "}
          <span style={{ color: "#E15554" }}>Dolphin!</span>
        </p>
      </div>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form">
          <input type="text" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit" className="btn submit">
            {loading?"loging...":"Submit"}
          </button>
        </form>
        <a onClick={()=> navigate('/register')} style={{"cursor":"pointer"}}>Create your account</a>
      </div>
    </div>
  );
};
