import React, { useContext, useEffect, useState } from 'react'
import "../styles/Navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png"
import AppContext from '../context/AuthContext';

export default function () {

    const navigate = useNavigate();

    const {token} = useContext(AppContext);
    console.log(token)

    const [bar, setBar] = useState(true);

    useEffect(()=> {
      
    }, [token])

  return (
    <div className='NavBar'>
        <nav>
            <div className='appName' onClick={() => navigate("/")}>
              <img src={logo} alt="" style={{width:"70px"}}/>
              <div className="navHeader">Meet Bridge</div>
            </div>
            <div className="navlist">
                <Link to="/Home" style={{textDecoration : "none", color : "white"}}>Join as Guest</Link>
               {!token ? <Link to="/auth" style={{textDecoration : "none", color : "white"}}>Register</Link> : <></>}
                <div role="button">
                    <Link to="/auth" style={{textDecoration:"none", color:"white"}}>{token ? <span onClick={() => (localStorage.removeItem("token"), navigate("/auth"))}>Logout</span> : "Login"}</Link>
                </div>
            </div>
            <div className='sideBar' onClick={() => setBar(!bar)}>
                {bar ? <i class="fa-solid fa-bars"></i> : <i class="fa-solid fa-xmark"></i>}
            </div>
        </nav>

        {bar ? <></> : 
        <div className='barMenu'>
           <Link to={() => navigate("/Home")}>Join As Guest</Link>
           {!token ? <Link to="/auth">Register</Link> : null}
           <Link to="/auth">{token ? <span onClick={() => (localStorage.removeItem("token"), navigate("/auth"))}>Logout</span> : "Login"}</Link>
           {token ? <Link to="/History">History</Link> : null}
        </div>
        }
    </div>
  )
}
