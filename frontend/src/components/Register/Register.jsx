import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Register.css'
import axios from 'axios';

export const Register = () => {
    const url = 'https://dolphinapi.onrender.com/'
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();

    const handleAnchor = ()=>{
        navigate('/login');
    }

    const handleSubmit = async (e) => {
      try {

        e.preventDefault();
        const Data = new FormData(e.currentTarget);
        const userData = {
            email: Data.get('email'),
            password: Data.get('password'),
            confirmpassword: Data.get('confirmpassword'),
        };

        if(userData.email=='' || userData.password=='' || userData.confirmpassword==''){alert('all inputs are required');return}
        if(userData.password!=userData.confirmpassword) {
            alert("password did not match")
            return;
        }
        console.log(userData);
        
        const  headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'mode': 'no-cors',
        }

        setLoading(true)
        const {data} = await axios.post(`${url}/register`,userData,headers);
        setLoading(false)
        //keeping user data in local storage
        if(data.status==200){
            localStorage.setItem("userData",JSON.stringify({email:data.user.email,_id:data.user._id}));
            navigate('/langSelect'); 
            return;
        }
        alert(data.msg);

        console.log(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
      };


  return (
    <div className='register-wrp'>
        <div className="header">
            <h3>Hey, Learner!</h3>
            <p>Let's get you <span style={{color:"#E15554"}}>Started!</span></p>
        </div>
        <div className="register-box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className='form'>
                <input type="text" name='email' placeholder='Email' />
                <input type="password" name='password' placeholder='Password' />
                <input type="password" name='confirmpassword' placeholder='Confirm Password' />
                <button disabled={loading} type='submit' className="btn submit">{loading?"Registering...":"Submit"}</button>
            </form>
            <a onClick={()=> navigate('/login')} style={{"cursor":"pointer"}}>I am already a learner!</a>
        </div>
    </div>
  )
}
