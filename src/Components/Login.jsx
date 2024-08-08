import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Login = () => {

  const [userInput,setUserInput]=useState('');
  const [passwordInput,setPasswordInput]=useState('')
  const [csrfToken,setCsrfToken]=useState('')

  const navigate = useNavigate();

  useEffect(()=>{
    axios.patch('https://chatify-api.up.railway.app/csrf')
    .then(response =>{
      setCsrfToken(response.data.csrfToken);
      console.log("Token hämtat:",response.data.csrfToken);
    })
    .catch(error=>{
      console.error("Kunde inte hämta token:", error)
    })
  },[]);

  const submit =()=>{
    axios.post('https://chatify-api.up.railway.app/auth/token',{
      username: userInput,
      password: passwordInput,
      csrfToken
    })
    .then(response =>{
      if (response.status === 200){
        console.log('Inloggning lyckades', response.data);
        const jwt = response.data.token;
        const jwtDecoded = jwtDecode(jwt);

        sessionStorage.setItem('token',jwt);
        sessionStorage.setItem('username', jwtDecoded.user);
        sessionStorage.setItem('email',jwtDecoded.email)
        sessionStorage.setItem('avatar', jwtDecoded.avatar)
        sessionStorage.setItem('id', jwtDecoded.id)

        navigate('/Chat')
      }
    })
    .catch(error => {
      console.error('Inloggning misslyckades:', error);
    });
  }

  return (
    <div>
     <h1>Login</h1>
     <br />
     <label>Användarnamn</label>
     <input 
     type="text" 
     placeholder='Användarnamn'
     value={userInput}
     onChange={(e)=> setUserInput (e.target.value)}
     />
     <br />
     <label>Lösenord</label>
     <input 
     type="password"
     placeholder='Lösenord'
     value={passwordInput}
     onChange={(e)=> setPasswordInput (e.target.value)}   
     />
     <br />
    <button type="submit" onClick={submit}>Skicka in</button>      
    </div>
  )
}

export default Login
