import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import MyOffCanvas from './MyOffCanvas';



const Chat = () => {
  const [userPost, setUserPost] = useState('');
  const [messages, setMessages] = useState([]);

  const avatar=sessionStorage.getItem('avatar');
  const username=sessionStorage.getItem('username');

  useEffect(() => {
    fetchMessages(); 
  }, []);

  const onUserPost = () => {
    const token = sessionStorage.getItem('token');
    const sanitizedUserPost = DOMPurify.sanitize(userPost);

    axios.post('https://chatify-api.up.railway.app/messages', {
      text: sanitizedUserPost,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Meddelande mottaget:', response.data);
      setUserPost('');
      fetchMessages(); 
    })
    .catch(error => {
      console.error('Meddelande ej mottaget:', error);
    });
  };

  const fetchMessages = () => {
    const token = sessionStorage.getItem('token');

    axios.get('https://chatify-api.up.railway.app/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Användarens post hämtade:', response.data);
      setMessages(response.data);
    })
    .catch(error => {
      console.error('Fel vid hämtning av user posts:', error);
    });
  };

  const deleteMessage = (id) => {
    const token = sessionStorage.getItem('token');
  
    axios.delete(`https://chatify-api.up.railway.app/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Meddelande raderat:', response.data);
      fetchMessages();
    })
    .catch(error => {
      console.error('Kunde ej radera meddelande:', error);
    });
  };

  return (
    <div>
      <header>
        <h1>hej {username}!</h1>
        <img src={avatar} width={'200px'} alt="avatar" />
      </header>
      <br />
     
      <MyOffCanvas username={username} avatar={avatar} />
      <label>Skriv ett inlägg:</label>
      <br />
      <input
        type="text"
        value={userPost}
        onChange={(e) => setUserPost(e.target.value)}
      />
      <br />
      <button type='button' onClick={onUserPost}>Skicka in</button>

      <div>
        <h3>Meddelanden:</h3>
        {messages.length > 0 ? (
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message.text} <button onClick={()=> deleteMessage(message.id)}>Radera medelande</button> </li>
            ))}
          </ul>
        ) : (
          <p>Inga meddelanden att visa</p>
        )}
      </div>
    </div>
  );
};

export default Chat;

