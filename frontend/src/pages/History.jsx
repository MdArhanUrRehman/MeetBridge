import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import "../styles/History.css";
import { motion } from "framer-motion";

export default function History() {
  const { getHistory } = useContext(AppContext);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setMeetings(data.data.message || []);
      } catch (error) {
        console.error("History fetch failed:", error);
      }
    };
    fetchHistory();
  }, [getHistory]);

  return (
    <>
      <Navbar />
      <div className="HistoryContainer">
        <div className="mainheader">
          <div className="HistoryHeader">
            <h1>Webinars &amp; Events</h1>
            <p>Your past and upcoming sessions at a glance</p>
          </div>

          <div className="HistoryBox">
            {meetings.map((e, i) => (
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
    </>
  );
}
