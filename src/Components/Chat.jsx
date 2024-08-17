import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import MyOffCanvas from './MyOffCanvas';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Chat = () => {
  const [userPost, setUserPost] = useState('');
  const [InviteNr, setInviteNr] = useState('');
  const [InviteList, setInviteList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [receivedInvites, setReceivedInvites] = useState([]);

  const avatar = sessionStorage.getItem('avatar');
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    loadInvitationFromLocalStorage();
  }, []);

  const onUserPost = () => {
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












  const HandleInvite = async () => {
    const cryptoId = crypto.randomUUID();
    const username = sessionStorage.getItem('username');
    const userId = InviteNr;
    const token = sessionStorage.getItem('token');

    if (!username || !token) {
      console.error('Username or token is missing');
      return;
    }

    try {
      const response = await axios.post(`https://chatify-api.up.railway.app/invite/${userId}`, {
        conversationId: cryptoId,
        username: username
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Invite sent successfully:', response.data);
      const newInvite = { username: InviteNr, conversationId: cryptoId, sentBy: username };
      localStorage.setItem(`invite-${cryptoId}`, JSON.stringify(newInvite));
      setInviteList(prevList => [...prevList, newInvite]);
      setInviteNr('');
    } catch (error) {
      console.error('Error sending invite:', error.response?.data || error.message);
    }
  };

  const loadInvitationFromLocalStorage = () => {
    const keys = Object.keys(localStorage);
    const invites = keys.filter(key => key.startsWith('invite-'))
      .map(key => JSON.parse(localStorage.getItem(key)))
      .filter(invite => invite.sentBy === username);

    setInviteList(invites);
  };

  const handleInviteSelect = (invite) => {
    setSelectedInvite(invite);
    navigate('/FriendChat', { state: { invite } }); // Ändra '/destination-path' till den ruta du vill navigera till
  };
  const handleInvitationSelect = (invite) => {
    setSelectedInvitation(invite);
    localStorage.setItem('selectedInvitation', JSON.stringify(invite));
    navigate('/FriendChat', { state: { invite} });
  };

  const retrieveInvitations = ()=>{

    try{
      const token = sessionStorage.getItem('token');

      const decodedToken = jwtDecode(token);
      const inviteString = decodedToken.invite || "[]";
      const invite = JSON.parse(inviteString);

      setReceivedInvites(Array.isArray(invite) ? invite :[]);
      console.log('hämtade invites lyckad')
    }catch(error){
      console.log('fel vid hämtning', error)
    }
  }






  return (
    <div>
      <header>
        <h1>Hej {username}!</h1>
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
              <li key={index}>
                {message.text} <button onClick={() => deleteMessage(message.id)}>Radera meddelande</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Inga meddelanden att visa</p>
        )}
      </div>
      <br />






      <div>
        <label>bjud in till chat</label>
        <input 
          type="text" 
          value={InviteNr}
          placeholder='id nr'
          onChange={(e) => setInviteNr(e.target.value)}
        />
        <br />
        <button onClick={HandleInvite}>Bjud in vän</button>
        <h2>Min inbjudningar som jag skickat</h2>
        <ul>
          {Array.isArray(InviteList) && InviteList.length > 0 ? (
            InviteList.map((invite, index) => (
              <li key={index}>
                <Button variant="link" onClick={() => handleInviteSelect(invite)}>
                  {invite.username || invite.conversationId}
                </Button>
              </li>
            ))
          ) : (
            <p>Inga inbjudningar tillgängliga</p>
          )}
        </ul>
        {selectedInvite && (
            <div>
              <h2>Skicka ett medelande till {selectedInvite.username || selectedInvite.conversationId}</h2>
              <Form.Control
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv medelande..."
              />
              <Button onClick={sendMessageToInvite}>Skicka</Button>
            </div>
          )}
      </div>
      <div>
        <h2>Hämta inbjudan från</h2>
        <button onClick={retrieveInvitations}>Hämta</button>
        <ul>
          {Array.isArray(receivedInvites) && receivedInvites.length > 0 ? (
            receivedInvites.map((invitation, idx) => (
              <li key={idx}>
                <Button variant="link" onClick={() => handleInvitationSelect(invitation)}>
                  {invitation.username || invitation.conversationId}
                </Button>
              </li>
            ))
          ) : (
            <p>Inga inbjudningar tillgängliga</p>
          )}
        </ul>
      </div>




    </div>
  );
};

export default Chat;


