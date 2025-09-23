import React, { useContext, useState } from "react";
import withAuth from "../util/auth";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AppContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/HomeComponent.css";
import LinkImage from "../assets/Link.svg";
import { v4 as uuidv4 } from "uuid";
import copyImage from "../assets/copy.png";
import copiedImage from "../assets/copied.png"

function HomeComponent() {
  const navigate = useNavigate();
  const { token, addToUserHistory } = useContext(AppContext);

  const [meetingCode, setMeetingCode] = useState("");
  const [freeze, setFreeze] = useState(false);
  const [copy, setCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleJoinVideo = async () => {
    if (!meetingCode) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handleGenerate = () => {
    if (!token) {
      navigate("/auth");
      return;
    }
    const id = uuidv4();
    setCopy(true);
    setFreeze(true);
    setMeetingCode(id);
  };

  const handleClipboard = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}\nmeeting code : ${meetingCode}`)
      .then(() => {
        setCopy(false);
        setCopied(true);
      });
  };

  return (
    <div className="MainPage">
      <Navbar />

      <div className="meetContainer">
        <div className="leftPanel">
          <div className="leftPanelContent">
            <h2>Providing Quality Video Just Like Quality Education</h2>
            <div className="meeting">
              <TextField
                className="inp"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Enter Meeting Code"
                variant="outlined"
                disabled={freeze}
              />
              <div className="btns">
                <Button
                  onClick={handleGenerate}
                  variant="contained"
                  disabled={freeze}
                  style={
                    freeze
                      ? { backgroundColor: "rgb(50, 100, 210)", color: "white" }
                      : null
                  }
                >
                  Generate meet
                </Button>
                <Button onClick={handleJoinVideo} variant="contained">
                  Join meet
                </Button>
                <div className="copy" onClick={handleClipboard}>
                  {copy ? (
                    <img src={copyImage} alt="" />
                  ) : copied ? (
                    <img src={copiedImage} alt="" />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img src={LinkImage} alt="Link illustration" />
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomeComponent);
