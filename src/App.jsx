import Login from "./Components/Login"
import Registration from "./Components/Registration"
import Chat from './Components/Chat'
import FriendChat from "./Components/FriendChat";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfile from "./Components/EditProfile";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import {Link,useNavigate} from 'react-router-dom';





function App() {
 
  return(
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Registration" element={<Registration/>}/>
        <Route path="/Chat" element={<Chat/>}/>
        <Route path="/FriendChat" element={<FriendChat/>}/>
        <Route path="/EditProfile" element={<EditProfile/>}/>
      </Routes>
    </Router>
    <ToastContainer />
    </div>
  
  )
}

export default App
