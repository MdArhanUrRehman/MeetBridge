import { useContext, useState, useEffect } from "react";
import { data, useNavigate } from "react-router";
import axios from "axios";
import "../styles/AuthPage.css"
import AuthImage from "../assets/AuthImage.svg"
import AppContext from "../context/AuthContext";

export default function Login() {
  const [state, setState] = useState("Sign Up");

  const { userSignUp, userLogin } = useContext(AppContext);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (state === "Sign Up") {
      const dataSignUp = {
        name: user.name,
        email: user.email,
        password: user.password,
      }
      

      const data = userSignUp(dataSignUp);

      if(data){
        setUser({
          name : "",
          email : "",
          password : "",
        });
      }else{
        console.log(data.message);
      }
    } else {
      const dataLogin = {
        email: user.email,
        password: user.password,
      }

      const data = userLogin(dataLogin);

      console.log(data)

      if(data){
        setUser({
          email : "",
          password : "",
        });
        console.log("logged in");
      }else{
        console.log(data.message);
      }
    }
  };

return (
    <div className="auth-container" onSubmit={onSubmitHandler}>
      <img src={AuthImage} alt="" className="authImage"/>
      {<form className="auth-form">
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

          <button
    type="submit"               // <-- ensure submit type
    className="submit-btn"
    disabled={loading}
  >
    {loading
      ? "Processing..."
      : state === "Sign Up"
        ? "Create Account"
        : "Login"}
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
      </form>}
    </div>
  );
}