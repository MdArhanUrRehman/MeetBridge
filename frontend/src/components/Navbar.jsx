import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/Logo.png";
import AppContext from "../context/AuthContext";
import toast from "react-hot-toast";
import menuImage from "../assets/menu.png";
import wrongImage from "../assets/wrong.png"

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    setMenuOpen(false);
    toast.success("Successfully Logged out!");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
    navigate("/");
  }
  }, [token]);

  return (
    <header className="NavBar">
      <nav>
        {/* Brand / Logo */}
        <div className="appName" onClick={() => navigate("/")}>
          <img src={logo} alt="Meet Bridge logo" className="Meetlogo"/>
          <div className="navHeader2">MB</div>
          <div className="navHeader">Meet Bridge</div>
        </div>

        {/* Desktop Links */}
        <div className="navlist">
          <Link to="/Home">Join as Guest</Link>
          {token && <Link to="/History">History</Link>}
          {!token && <Link to="/auth">Register</Link>}
          <div className="loginBtn">
            {token ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/auth" style={{ color: "white" }}>
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle Icon */}
        <div className="sideBar" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <img src={wrongImage} alt="" />
          ) : (
            <img src={menuImage} alt="" />
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div className="menuOverlay" onClick={() => setMenuOpen(false)} />
          <div className="barMenu">
            <Link to="/Home" onClick={() => setMenuOpen(false)}>
              Join as Guest
            </Link>
            {!token && (
              <Link to="/auth" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            )}
            {token && (
              <Link to="/History" onClick={() => setMenuOpen(false)}>
                History
              </Link>
            )}
            {token ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
}
