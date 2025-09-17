import "../styles/LandingPage.css"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar";
import LandinPageImage from "../assets/LandingPage.svg"

export default function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="landingPageContainer">
        <Navbar/>

        <div className="landingContainer">
            <div className="left-side">
               <h2 style={{fontSize : "2rem"}}><span style={{color:"rgb(50, 100, 210)"}}>Connect</span> with your loved ones</h2>
               <p>Cover a distance by Video Call</p>
               <div role="button">
                <Link to={"/Home"} className="start-button">Get Started</Link>
               </div>
            </div>

            <img src={LandinPageImage} alt="" />

        </div>
    </div>
  )
}