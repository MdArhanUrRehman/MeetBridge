import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import "../styles/History.css";
import { motion } from "framer-motion";

export default function History() {
  const { getHistory } = useContext(AppContext);

  const [meetings, setMeetings] = useState([]);

  let gethistory = async () => {
    try {
      let data = await getHistory();
      console.log(data);
      setMeetings(data.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    gethistory();
  }, []);

  console.log(meetings);

  return (
    <div className="HistoryContainer">
      <Navbar />
      <div className="mainheader">

      <div className="HistoryHeader">
        <h1>Webinars & Events</h1>
        <p>Your past and upcoming sessions at a glance</p>
      </div>

      <div className="HistoryBox">
        {meetings?.map((e, i) => (
          <motion.div
            key={e._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography className="MeetingTitle">
                  Name: {e.user_id}
                </Typography>
                <Typography className="MeetingSub">
                  Code: {e.meetingCode}
                </Typography>
                <Typography className="MeetingDetails">
                  Date: {new Date(e.date).toLocaleDateString("en-IN")}
                </Typography>
                <Typography>
                  Time:{" "}
                  {new Date(e.date).toLocaleTimeString("en-IN", {
                    hour12: true,
                  })}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
