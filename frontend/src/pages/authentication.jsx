import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Login() {
  const [state, setState] = useState("Sign Up");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (state === "Sign Up") {
      const { data } = await axios.post("https://videoconferencing-2.onrender.com/api/v1/user/signup", {
        name: user.name,
        email: user.email,
        password: user.password,
      });


      if(data.success === true){
        setUser({
          name : "",
          email : "",
          password : "",
        });
        console.log(data);
      }else{
        console.log(data.message);
      }
    } else {
      const { data } = await axios.post("https://videoconferencing-2.onrender.com/api/v1/user/login", {
        email: user.email,
        password: user.password,
      });

      console.log(data)

      if(data.success){
        setUser({
          email : "",
          password : "",
          
        });
        localStorage.setItem("token", data.message);
        console.log("logged in");
      }else{
        console.log(data.message);
      }
    }
  };

return (
    <div className="auth-container" onSubmit={onSubmitHandler}>
      <form className="auth-form">
        <div className="auth-box">
          <p className="auth-title">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p className="auth-subtitle">
            Please{" "}
            {state === "Sign Up" ? (
              <span className="highlight">Sign Up</span>
            ) : (
              <span className="highlight">Login</span>
            )}{" "}
            to book appointment
          </p>

          {state === "Sign Up" && (
            <div className="input-group">
              <p>Full Name</p>
              <input
                type="text"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                value={user.name}
                required
              />
            </div>
          )}

          <div className="input-group">
            <p>Email</p>
            <input
              type="text"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              value={user.email}
              required
            />
          </div>

          <div className="input-group">
            <p>Password</p>
            <input
              type="text"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
              required
            />
          </div>

          <button className="submit-btn">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>

          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span className="link" onClick={() => setState("Login")}>
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create a new account?{" "}
              <span className="link" onClick={() => setState("Sign Up")}>
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}