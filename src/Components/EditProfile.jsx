import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

  const [username,setUsername]=useState('')
  const  [email,setEmail]=useState('')
  const [avatar,setAvatar]=useState('')
  const [avatarPreview,setAvatarPreview]=useState('')

  const navigate = useNavigate();

  useEffect(()=>{
    const storedUsername=sessionStorage.getItem('username')
    const storedEmail=sessionStorage.getItem('email')
    const storedAvatar=sessionStorage.getItem('avatar')

    if(storedUsername){
      setUsername(storedUsername);
      setEmail(storedEmail)
      setAvatarPreview(storedAvatar)
    }
  },[])

  const handleFileChange = async (event)=>{

    // hämtar vald bild
    const file=event.target.files[0];
    if(!file)return;
    // hämtar apiKey från .env
    const apiKey=import.meta.env.VITE_IMGBB_API_KEY;

    // skapar nytt objekt,limmar fast värderna du har hämtat, bild och nyckel.
    const formData = new FormData();
    formData.append('key',apiKey);
    formData.append('image',file)

    // apiURl som bilden sparas i och hämtas från
    const apiUrl= 'https://api.imgbb.com/1/upload';

    // skickar över nya objektet till sidan som hostar bilderna du väljer i din dator
    try {
      const response = await axios.post(apiUrl, formData);
  
      // kontrollera om response är framgångsrik
      if (response.status !== 200) {
        throw new Error('Nätverksrespons dålig');
      }
  
      // hämta url från den uppladdade bilden från urlresponsen
      const imageUrl = response.data.data.url;
  
      setAvatar(imageUrl);
      setAvatarPreview(imageUrl);
  
      console.info('Bild uppladdad');
    } catch (error) {
      console.error('Tyvärr fel vid uppladdning', error);
    }

  }


  const OnUpdate = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');
  
    try {
      const response = await axios.put('https://chatify-api.up.railway.app/user', {
        userId: userId,
        updatedData: {
          avatar: avatar,
          email: email,
          username: username,
        }
      }, {
        headers: {  // Se till att använda 'headers'
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Om uppdateringen lyckas, uppdatera sessionStorage och visa toast
      sessionStorage.setItem('avatar', avatar);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('username', username);
  
      toast.success("Profilen uppdaterades framgångsrikt!");
  
      navigate('/Chat');
  
    } catch (error) {
      console.error('Fel vid uppdatering', error);
      toast.error('Ett fel inträffade vid uppdatering av profilen');
    }
  }
  

  const OnDelete=()=>{

    const token=sessionStorage.getItem('token')
    const userId=sessionStorage.getItem('id')

    const confirmation=window.confirm('säker att du vill radera konto,går ej att ångra')
    if(!confirmation){
      return;
    }

    try{
      axios.delete('https://chatify-api.up.railway.app/users/{userId}',{
        headers:{
          Authorization:`bearer ${token}`
        }
      })

      toast.success('Konto är nu raderat')
      sessionStorage.clear();
      localStorage.clear();
      navigate('/Login')
    }catch (error){
      console.log('fel vid radering av konto', error)
    }

  }

  
  return (
    <div>
      <h1>Redigera Profil {username} <br /> <img src={avatarPreview} style={{width:'150px', height:'180px'}} alt="avatar" /></h1>
      <br />
      <label>Användarnamn</label>
      <input 
      type="text"
      placeholder={username}
      value={username}
      onChange={(e)=> ChangeUserName (e.target.value)}
      />
      <br />
      <label>Email</label>
      <input 
      type="email"
      placeholder={email}
      value={email}
      onChange={(e)=> ChangeUserEmail (e.target.value)}      
      />
      <br />
      <label>Avatar</label>
      <input 
      type="file" 
      placeholder={avatar}
      onChange={handleFileChange}
      />
      {avatarPreview && (<img src={avatarPreview} alt="avatar preview" style={{width:'120px', height:'130px'}} />)}
      <br />
      <button onClick={OnDelete}>Radera konto</button>
      <button onClick={OnUpdate}>Uppdatera profil</button>
      <br />
      <Link to='/Chat'>Tillbaka till chat</Link>
    </div>


  )
}

export default EditProfile
