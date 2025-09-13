import React, { useContext } from 'react'
import withAuth from '../util/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AppContext from '../context/AuthContext';

function HomeComponent() {

  let navigate = useNavigate();

  const {addToUserHistory} = useContext(AppContext);

  const [meetingCode, setMettingCode] = useState('');

  let handleJoinVideo = async () => {
     await addToUserHistory(meetingCode);
     navigate(`/${meetingCode}`)
  }

  return (
    <div>
      <div className="navbar">
        <div style={{display:"flex", alignItems:"center" }}>
          <h3>Video Confress</h3>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"12px" }}>
          <IconButton>
            <RestoreIcon/>
            <p onClick={() => navigate('/history')}>History</p>
          </IconButton>
          <Button onClick={() => (localStorage.removeItem("token"), navigate("/auth"))}>Logout</Button>
        </div>
      </div>


      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Just Like Quality Education</h2>
            <div style={{display:"flex", gap:"10px"}}>
              <TextField onChange={e => setMettingCode(e.target.value)} id='outlined-basic' label="Meeting Code" variant='outlined'/>
              <Button onClick={handleJoinVideo} variant='contained'>Join</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default withAuth(HomeComponent);