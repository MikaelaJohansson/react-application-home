import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Registration = () => {
  const [csrfToken,setCsrfToken]=useState('');
  const [userInput,setUserInput]= useState('');
  const [passwordInput,setPassWordInput]= useState('');
  const [mailInput,setMailInput]= useState('');

  const navigate = useNavigate(); 

  useEffect(()=>{

    axios.patch('https://chatify-api.up.railway.app/csrf')
    .then(response=>{
      setCsrfToken(response.data.csrfToken); 
      console.log("token hämtat")
      console.log(csrfToken);
    })
    .catch(error=>{
      console.error("token går ej att hämta",error);
    })

  },[]);

  const Registration = () => {
    
    
    axios.post('https://chatify-api.up.railway.app/auth/register',
      {
        username: userInput,
        password: passwordInput,
        email: mailInput,
        avatar: "https://i.pravatar.cc/200",
        csrfToken
      })
      .then(response =>{
        if(response.status === 201){
          console.log('registrerad', response.data);
          alert("Användare registrerad framgångsrikt")
          

          setUserInput('')
          setPassWordInput('')
          setMailInput('')

          navigate('/Login');
        }
      });
    
    
  }

  return (
    <div>
      <section>
        <h1>Skapa konto här</h1>
        <label>Användarnamn</label>
        <input 
        type="text"
        placeholder='Användare'
        value={userInput}
        onChange={(e)=> setUserInput (e.target.value)}
        />
        <br />
        <label>Lösenord</label>
        <input 
        type="text"
        placeholder='Lösen'
        value={passwordInput}
        onChange={(e) => setPassWordInput(e.target.value)}
        />
        <br />
        <label>Email</label>
        <input 
        type="text"
        placeholder='Mail'
        value={mailInput}
        onChange={(e)=> setMailInput (e.target.value)} 
        />
        <br />
        <button onClick={Registration} >Skicka in</button>
      </section>
    </div>
  )
 
}

export default Registration
