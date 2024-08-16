import React, { useState } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyOffCanvas = ({username,avatar}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate=useNavigate();

  const LogOut= ()=>{
    sessionStorage.clear();
    alert('Du är nu utloggad');
    navigate('/Login');
  }

  const EditProfile=()=>{
    navigate('/EditProfile');
  }

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>Profil</Button>

      <Offcanvas show={show} onClick={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profil:</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h1>{username}</h1>
          <img src={avatar} width={'200px'} alt="avatar" />
          <br />
          <button type='button' onClick={LogOut}>Logga ut</button>
          <button type='button' onClick={EditProfile}>Redigera profil</button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default MyOffCanvas;

