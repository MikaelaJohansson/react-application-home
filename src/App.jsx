import Login from "./Components/Login"
import Registration from "./Components/Registration"
import Chat from './Components/Chat'

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
      </Routes>
    </Router>
    </div>
  
  )
}

export default App
