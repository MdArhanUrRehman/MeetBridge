import "../App.css"
import { Link, useNavigate } from "react-router-dom"

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="landingPageContainer">
        <nav>
            <div className="navHeader"><h2>Video Call</h2></div>
            <div className="navlist">
                <Link to="/gad645">Join as Guest</Link>
                <p>Register</p>
                <div role="button">
                    <p>Login</p>
                </div>
            </div>
        </nav>

        <div className="landingContainer">
            <div className="left-side">
               <h2 style={{fontSize : "2rem"}}><span style={{color:"orange"}}>Connect</span> with your loved ones</h2>
               <p>Cover a distance by Video Call</p>
               <div role="button">
                <Link to={"/Home"} className="start-button">Get Started</Link>
               </div>
            </div>

            {/* <div className="">
               <p>Hello</p>
            </div> */}
        </div>
    </div>
  )
}
