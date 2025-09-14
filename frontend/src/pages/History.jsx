import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AuthContext";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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
    <div>
      {meetings?.map((e) => (
        <Card key={e._id} variant="outlined">
          {
            <React.Fragment>
              <CardContent>
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                  {e.user_id}
                </Typography>
                <Typography variant="body2">
                  Meeting Code : {`${e.meetingCode}`}
                </Typography>
                <Typography variant="body2">
                  Date : {new Date(e.date).toLocaleDateString('en-IN')}
                  <br />
                  Time : {new Date(e.date).toLocaleTimeString('en-IN', {hour12 : true})}
                </Typography>

              </CardContent>
            </React.Fragment>
          }
        </Card>
      ))}
    </div>
  );
}
