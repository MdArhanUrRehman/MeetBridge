import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Badge from "@mui/material/Badge";
import styles from "../styles/videoComponent.module.css";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

const server_url = "https://videoconferencing-2.onrender.com";

const connections = {};

const peerConfigConnection = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoComponent() {
  const navigate = useNavigate();

  var socketRef = useRef();

  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(false);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("HELLO");
    getPermissions();
  });

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => {
            setScreen(false);
          });
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnection
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo(!video);
    // getUserMedia();
  };
  let handleAudio = () => {
    setAudio(!audio);
    // getUserMedia();
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      console.log(tracks);
      console.log(socketIdRef);
      socketRef.current.emit("user-left", socketIdRef.current);
      socketRef.current.disconnect();
      tracks.forEach((track) => track.stop());
      console.log("stoped");
    } catch (e) {}
    navigate("/");
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  let closeChat = () => {
    setModal(false);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = (e) => {
    e.preventDefault();
    if (message === "") return;
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");

    // this.setState({ message: "", sender: username })
  };

  let connect = () => {
    if(username === "") return;
    setAskForUsername(false);
    getMedia();
  };

  console.log(videos);

  return (
    <div className={styles.mainContainer}>
      {/* <video ref={localVideoRef} autoPlay
        playsInline
        muted
        style={{ width: "100vw", height : "100vh", border: "1px solid black" }}></video>
        <button onClick={() => call()}>click</button> */}
      {askForUsername === true ? (
        <div className={styles.lobbyContainer}>
          <div className={styles.lobbyName}>
            <h2>Enter into Lobby</h2>
            <TextField
              value={username}
              fullWidth
              label="Enter Your name"
              id="fullWidth"
              onChange={(e) => setUsername(e.target.value)}
              className={styles.TextField}
            />
            <Button variant="contained" onClick={() => connect()}>
              Connect
            </Button>
          </div>
         
          <video
            ref={localVideoref}
            autoPlay
            playsInline
            muted
           className={styles.lobbyVideo}
          ></video>
        </div>
      ) : (
        <>
          <div className={styles.meetVideoContainer}>
            {!askForUsername && showModal ? (
              <div className={styles.chatRoom}>
                <h1 style={{ color: "Black", textAlign: "center" }}>CHATS</h1>
                <hr />

                <div className={styles.chattingDisplay}>
                  {messages?.map((item, index) => (
                    <div key={index} className={styles.userMessage}>
                      <p style={{ fontWeight: "600" }}>{item.sender} : </p>

                      <p>{item.data}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.chatContainer}>
                  <div className={styles.messageForm}>
                    <input
                      type="text"
                      name="userSend"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      id=""
                      placeholder="Ask your questions?"
                    />
                    <Button
                      onClick={sendMessage}
                      variant="contained"
                      className={styles.sendButton}
                    >
                      <SendIcon />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className={styles.buttonContainer}>
              <IconButton onClick={handleVideo}>
                {video === true ? (
                  <VideoCameraFrontIcon style={{ fontSize: "3rem" }} />
                ) : (
                  <VideocamOffIcon style={{ fontSize: "3rem" }} />
                )}
              </IconButton>
              <IconButton onClick={handleAudio}>
                {audio === true ? (
                  <MicIcon style={{ fontSize: "2.5rem", cursor: "pointer" }} />
                ) : (
                  <MicOffIcon style={{ fontSize: "2.5rem" }} />
                )}
              </IconButton>
              <IconButton onClick={handleScreen}>
                {screen == true ? (
                  <ScreenShareIcon style={{ fontSize: "2.5rem" }} />
                ) : (
                  <StopScreenShareIcon style={{ fontSize: "2.5rem" }} />
                )}
              </IconButton>
              <IconButton onClick={handleEndCall}>
                <div className={styles.callEnd}>
                  <CallEndOutlinedIcon style={{ fontSize: "1.7rem" }} />
                </div>
              </IconButton>
            </div>
            <div
              className={styles.messages}
              onClick={showModal ? closeChat : openChat}
            >
              <Badge
                badgeContent={!showModal ? newMessages : null}
                max={999}
                color="error"
              >
                <IconButton>
                  <ChatOutlinedIcon
                    style={
                      showModal
                        ? { color: "black", fontSize: "1.8rem" }
                        : { color: "white", fontSize: "1.8rem" }
                    }
                  />
                </IconButton>
              </Badge>
            </div>

            <video
              ref={localVideoref}
              autoPlay
              className={`${styles.meetUserVideo} ${
                showModal ? styles.goLeft : styles.goRight
              }`}
            ></video>
            <div className={styles.conferenceContainer}>
              {videos.map((video) => (
                <video
                  key={video.socketId + video.stream.id}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                      ref
                        .play()
                        .catch((err) =>
                          console.warn("Autoplay prevented:", err)
                        );
                    }
                  }}
                  autoPlay
                  playsInline
                  className={styles.videoStream}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
